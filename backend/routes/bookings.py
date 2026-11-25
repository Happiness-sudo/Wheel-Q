import secrets
import string
from datetime import datetime

from flask import Blueprint, jsonify, request

from backend import db
from backend.models.booking import Booking
from backend.models.car import Car

bookings_bp = Blueprint("bookings", __name__)


def generate_reference():
    characters = string.ascii_uppercase + string.digits

    while True:
        code = "WQ-" + "".join(
            secrets.choice(characters) for _ in range(6)
        )

        if not Booking.query.filter_by(reference=code).first():
            return code


def booking_data(booking):
    return {
        "id": booking.id,
        "reference": booking.reference,
        "car_id": booking.car_id,
        "car_name": booking.car.name,
        "customer_name": booking.customer_name,
        "pickup_date": booking.pickup_date.isoformat(),
        "return_date": booking.return_date.isoformat(),
        "days": booking.days,
        "daily_rate": booking.daily_rate,
        "total_amount": booking.total_amount,
        "status": booking.status,
        "created_at": booking.created_at.isoformat(),
    }


@bookings_bp.route("", methods=["POST"])
def create_booking():
    data = request.get_json(silent=True) or {}

    required = [
        "car_id",
        "customer_name",
        "phone",
        "pickup_date",
        "return_date",
    ]

    if any(not str(data.get(field, "")).strip() for field in required):
        return jsonify({"error": "Complete all required booking fields."}), 400

    try:
        car_id = int(data["car_id"])
        pickup_date = datetime.strptime(
            data["pickup_date"], "%Y-%m-%d"
        ).date()
        return_date = datetime.strptime(
            data["return_date"], "%Y-%m-%d"
        ).date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid vehicle or booking dates."}), 400

    if return_date <= pickup_date:
        return jsonify({
            "error": "Return date must be after pick-up date."
        }), 400

    car = db.session.get(Car, car_id)

    if not car:
        return jsonify({"error": "Vehicle not found."}), 404

    if car.status != "Available":
        return jsonify({
            "error": "This vehicle is currently unavailable."
        }), 409

    overlapping = Booking.query.filter(
        Booking.car_id == car_id,
        Booking.status != "Cancelled",
        Booking.pickup_date < return_date,
        Booking.return_date > pickup_date,
    ).first()

    if overlapping:
        return jsonify({
            "error": "This vehicle is already reserved for those dates."
        }), 409

    customer_name = str(data["customer_name"]).strip()
    phone = str(data["phone"]).strip()
    email = str(data.get("email", "")).strip() or None

    if len(customer_name) > 120 or len(phone) > 30:
        return jsonify({"error": "Customer details are too long."}), 400

    if email and len(email) > 120:
        return jsonify({"error": "Email address is too long."}), 400

    days = (return_date - pickup_date).days
    daily_rate = car.price

    booking = Booking(
        reference=generate_reference(),
        car_id=car.id,
        customer_name=customer_name,
        phone=phone,
        email=email,
        pickup_date=pickup_date,
        return_date=return_date,
        days=days,
        daily_rate=daily_rate,
        total_amount=daily_rate * days,
        status="Pending",
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify(booking_data(booking)), 201


@bookings_bp.route("/<string:reference>", methods=["GET"])
def find_booking(reference):
    phone = request.args.get("phone", "").strip()

    if not phone:
        return jsonify({"error": "Phone number is required."}), 400

    booking = Booking.query.filter_by(
        reference=reference.strip().upper(),
        phone=phone,
    ).first()

    if not booking:
        return jsonify({
            "error": "No booking matches that reference and phone number."
        }), 404

    return jsonify(booking_data(booking))
