
import os
from datetime import timedelta
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    database_path = os.path.join(base_dir, "wheelq.db")

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["ADMIN_EMAIL"] = os.getenv("ADMIN_EMAIL", "")
    app.config["ADMIN_PASSWORD"] = os.getenv("ADMIN_PASSWORD", "")

    if not app.config["SECRET_KEY"]:
        raise RuntimeError("SECRET_KEY must be configured in .env")

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///" + database_path.replace("\\", "/")
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["UPLOAD_FOLDER"] = os.path.join(
        base_dir, "uploads", "cars"
    )

    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

    app.config["REMEMBER_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    app.config["SESSION_COOKIE_SECURE"] = (
        os.getenv("COOKIE_SECURE", "false").lower() == "true"
    )

    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
        seconds=int(os.getenv("ADMIN_TOKEN_MAX_AGE", "28800"))
    )

    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175"
        ],
        allow_headers=["Content-Type", "X-CSRF-Token"]
    )

    db.init_app(app)
    login_manager.init_app(app)

    from backend.models.car import Car
    from backend.models.booking import Booking

    from backend.routes.cars import cars_bp
    from backend.routes.bookings import bookings_bp
    from backend.routes.admin import admin_bp

    app.register_blueprint(cars_bp, url_prefix="/api/cars")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    with app.app_context():
        db.create_all()

    return app
