import os
import uuid
from backend.routes.admin import admin_required, csrf_required
from flask import Blueprint, current_app, jsonify, request, send_from_directory
from backend import db
from backend.models.car import Car

cars_bp = Blueprint("cars", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def car_data(car):
    return {
        "id": car.id,
        "name": car.name,
        "plate": car.plate,
        "category": car.category,
        "price": car.price,
        "status": car.status,
        "image": f"/api/cars/images/{car.image}" if car.image else "",
        "seats": car.seats,
        "transmission": car.transmission,
        "fuel": car.fuel,
    }


@cars_bp.route("", methods=["GET"])
def list_cars():
    cars = Car.query.order_by(Car.id.desc()).all()
    return jsonify([car_data(car) for car in cars])


@cars_bp.route("", methods=["POST"])
def create_car():
    auth_error = admin_required()
    if auth_error:
        return auth_error

    csrf_error = csrf_required()
    if csrf_error:
        return csrf_error
    data = request.form if request.form else (request.get_json(silent=True) or {})

    required = ["name", "plate", "category", "price"]
    if any(not str(data.get(field, "")).strip() for field in required):
        return jsonify({"error": "Complete all required vehicle fields."}), 400

    try:
        price = int(data["price"])
        seats = int(data.get("seats", 5))
    except (ValueError, TypeError):
        return jsonify({"error": "Price and seats must be valid numbers."}), 400

    if price < 0 or seats < 1:
        return jsonify({"error": "Invalid price or seat count."}), 400

    plate = str(data["plate"]).strip().upper()

    if Car.query.filter_by(plate=plate).first():
        return jsonify({"error": "This registration number already exists."}), 409

    image_name = None
    uploaded = request.files.get("image")

    if uploaded and uploaded.filename:
        if not allowed_file(uploaded.filename):
            return jsonify({"error": "Use PNG, JPG, JPEG or WEBP images."}), 400

        extension = uploaded.filename.rsplit(".", 1)[1].lower()
        image_name = f"{uuid.uuid4().hex}.{extension}"
        os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
        uploaded.save(os.path.join(current_app.config["UPLOAD_FOLDER"], image_name))

    car = Car(
        name=str(data["name"]).strip(),
        plate=plate,
        category=str(data["category"]).strip(),
        price=price,
        status=str(data.get("status", "Available")).strip(),
        image=image_name,
        seats=seats,
        transmission=str(data.get("transmission", "Automatic")),
        fuel=str(data.get("fuel", "Petrol")),
    )

    db.session.add(car)
    db.session.commit()
    return jsonify(car_data(car)), 201


@cars_bp.route("/<int:car_id>", methods=["PUT"])
def update_car(car_id):
    auth_error = admin_required()
    if auth_error:
        return auth_error

    csrf_error = csrf_required()
    if csrf_error:
        return csrf_error
    car = db.session.get(Car, car_id)
    if not car:
        return jsonify({"error": "Vehicle not found."}), 404

    data = request.form if request.form else (request.get_json(silent=True) or {})

    if "name" in data:
        car.name = str(data["name"]).strip()

    if "plate" in data:
        plate = str(data["plate"]).strip().upper()
        existing = Car.query.filter_by(plate=plate).first()
        if existing and existing.id != car.id:
            return jsonify({"error": "Registration number already exists."}), 409
        car.plate = plate

    if "category" in data:
        car.category = str(data["category"]).strip()

    if "price" in data:
        try:
            price = int(data["price"])
            if price < 0:
                raise ValueError()
            car.price = price
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid price."}), 400

    if "status" in data:
        if data["status"] not in {"Available", "Booked", "Unavailable"}:
            return jsonify({"error": "Invalid status."}), 400
        car.status = data["status"]

    if "seats" in data:
        try:
            seats = int(data["seats"])
            if seats < 1:
                raise ValueError()
            car.seats = seats
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid seat count."}), 400

    for field in ["transmission", "fuel"]:
        if field in data:
            setattr(car, field, data[field])

    uploaded = request.files.get("image")
    if uploaded and uploaded.filename:
        if not allowed_file(uploaded.filename):
            return jsonify({"error": "Unsupported image format."}), 400

        extension = uploaded.filename.rsplit(".", 1)[1].lower()
        image_name = f"{uuid.uuid4().hex}.{extension}"
        os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
        uploaded.save(os.path.join(current_app.config["UPLOAD_FOLDER"], image_name))
        car.image = image_name

    db.session.commit()
    return jsonify(car_data(car))


@cars_bp.route("/<int:car_id>", methods=["DELETE"])
def delete_car(car_id):
    auth_error = admin_required()
    if auth_error:
        return auth_error
    csrf_error = csrf_required()
    if csrf_error:
        return csrf_error
    car = db.session.get(Car, car_id)
    if not car:
        return jsonify({"error": "Vehicle not found."}), 404

    if car.image:
        image_path = os.path.join(current_app.config["UPLOAD_FOLDER"], car.image)
        if os.path.isfile(image_path):
            os.remove(image_path)

    db.session.delete(car)
    db.session.commit()
    return jsonify({"message": "Vehicle deleted successfully."})


@cars_bp.route("/images/<filename>", methods=["GET"])
def get_car_image(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)
