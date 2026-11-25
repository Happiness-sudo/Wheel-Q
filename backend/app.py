from flask import jsonify
from backend import create_app

app = create_app()


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to Wheel Q API",
        "status": "running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
