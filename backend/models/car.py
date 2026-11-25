from backend import db


class Car(db.Model):
    __tablename__ = "cars"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    plate = db.Column(db.String(30), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(30), default="Available", nullable=False)
    image = db.Column(db.String(255), nullable=True)
    seats = db.Column(db.Integer, default=5)
    transmission = db.Column(db.String(30), default="Automatic")
    fuel = db.Column(db.String(30), default="Petrol")
