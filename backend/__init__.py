import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    database_path = os.path.join(base_dir, "wheelq.db")

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///" + database_path.replace("\\", "/")
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = os.path.join(
        base_dir, "uploads", "cars"
    )
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

    CORS(app)
    db.init_app(app)

    from backend.models.car import Car
    from backend.routes.cars import cars_bp

    app.register_blueprint(cars_bp, url_prefix="/api/cars")

    with app.app_context():
        db.create_all()

    return app
