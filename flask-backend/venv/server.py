from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/tourism_ecommerce'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class SessionCookieUnauth(db.Model):
    __tablename__ = 'session_cookies_unauth'
    s_unauth_id = db.Column(db.Integer, primary_key=True)
    unauth_cookie = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# Route to store the unauthorized cookie in the database
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
