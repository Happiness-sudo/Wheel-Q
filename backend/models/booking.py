
from datetime import datetime
from backend import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)

    reference = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    car_id = db.Column(
        db.Integer,
        db.ForeignKey("cars.id"),
        nullable=False
    )

    customer_name = db.Column(
        db.String(120),
        nullable=False
    )

    phone = db.Column(
        db.String(30),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        nullable=True
    )

    pickup_date = db.Column(
        db.Date,
        nullable=False
    )

    return_date = db.Column(
        db.Date,
        nullable=False 
    )

    days = db.Column(db.Integer, nullable=False)

    daily_rate = db.Column(db.Integer, nullable=False)

    total_amount = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.String(30),
        default="Pending",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    car = db.relationship("Car", backref="bookings")
