import hmac
import secrets

from flask import Blueprint, jsonify, request, session, current_app
from werkzeug.security import check_password_hash

admin_bp = Blueprint("admin", __name__)


def csrf_valid():
    supplied = request.headers.get("X-CSRF-Token", "")
    expected = session.get("csrf_token", "")

    return bool(expected) and hmac.compare_digest(supplied, expected)


def csrf_required():
    if not csrf_valid():
        return jsonify({"error": "Invalid or expired security token."}), 403
    return None


def admin_required():
    if not session.get("admin_authenticated"):
        return jsonify({"error": "Admin authentication required."}), 401
    return None


@admin_bp.route("/csrf", methods=["GET"])
def get_csrf():
    if not session.get("csrf_token"):
        session["csrf_token"] = secrets.token_urlsafe(32)

    return jsonify({"csrf_token": session["csrf_token"]})


@admin_bp.route("/login", methods=["POST"])
def login():
    csrf_error = csrf_required()
    if csrf_error:
        return csrf_error

    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    admin_email = current_app.config.get("ADMIN_EMAIL", "").strip().lower()
    password_hash = current_app.config.get("ADMIN_PASSWORD", "")

    if not admin_email or not password_hash:
        return jsonify({"error": "Admin credentials are not configured."}), 500

    email_valid = hmac.compare_digest(email, admin_email)

    try:
        password_valid = check_password_hash(password_hash, password)
    except (ValueError, TypeError):
        password_valid = False

    if not email_valid or not password_valid:
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session.permanent = True
    session["admin_authenticated"] = True
    session["csrf_token"] = secrets.token_urlsafe(32)

    return jsonify({
        "message": "Login successful.",
        "authenticated": True,
        "csrf_token": session["csrf_token"]
    })


@admin_bp.route("/me", methods=["GET"])
def me():
    authenticated = bool(session.get("admin_authenticated"))

    return jsonify({
        "authenticated": authenticated
    })


@admin_bp.route("/logout", methods=["POST"])
def logout():
    csrf_error = csrf_required()
    if csrf_error:
        return csrf_error

    session.clear()

    return jsonify({"message": "Logged out successfully."})
