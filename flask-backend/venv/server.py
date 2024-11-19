from flask import Flask, jsonify, request
from flask_cors import CORS
from connection import db, init_app

app = Flask(__name__)
CORS(app)

init_app(app)


class SessionCookieUnauth(db.Model):
    __tablename__ = 'session_cookies_unauth'
    s_unauth_id = db.Column(db.Integer, primary_key=True)
    unauth_cookie = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


@app.route('/api/store-unauth-cookie', methods=['POST'])
def store_unauth_cookie():
    data = request.json
    unauth_cookie = data.get('unauth_cookie')

    if unauth_cookie:
        new_cookie = SessionCookieUnauth(unauth_cookie=unauth_cookie)
        db.session.add(new_cookie)
        db.session.commit()
        return jsonify({"message": "Cookie stored successfully"}), 201
    return jsonify({"message": "Invalid request"}), 400





if __name__ == '__main__':
    app.run(port=5000)
