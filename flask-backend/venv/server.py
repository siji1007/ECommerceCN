from flask import Flask, jsonify, request
from flask_cors import CORS
from connection import db, init_app
import secrets

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["*"])


init_app(app)


class SessionCookieUnauth(db.Model):
    __tablename__ = 'session_cookies_unauth'
    s_unauth_id = db.Column(db.Integer, primary_key=True)
    unauth_cookie = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Foreign Key to users table

    user = db.relationship('User', backref=db.backref('sessions', lazy=True))  # Link back to User



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


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    birth_month = db.Column(db.String(50), nullable=False)
    birth_day = db.Column(db.String(50), nullable=False)
    birth_year = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10))
    email_or_mobile = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, first_name, last_name, birth_month, birth_day, birth_year, gender, email_or_mobile, password):
        self.first_name = first_name
        self.last_name = last_name
        self.birth_month = birth_month
        self.birth_day = birth_day
        self.birth_year = birth_years
        self.gender = gender
        self.email_or_mobile = email_or_mobile
        self.password = password

# Register route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ['first_name', 'last_name', 'birth_month', 'birth_day', 'birth_year', 'email_or_mobile', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400

    # Extract data
    first_name = data['first_name']
    last_name = data['last_name']
    birth_month = data['birth_month']
    birth_day = data['birth_day']
    birth_year = data['birth_year']
    gender = data.get('gender', '')  # Optional gender
    email_or_mobile = data['email_or_mobile']
    password = data['password']

    # Create a new user object
    user = User(
        first_name=first_name,
        last_name=last_name,
        birth_month=birth_month,
        birth_day=birth_day,
        birth_year=birth_year,
        gender=gender,
        email_or_mobile=email_or_mobile,
        password=password
    )

    # Add the user to the database
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500



@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email_or_mobile = data.get('emailOrMobile')
        password = data.get('password')

        # Find the user by email or mobile
        user = User.query.filter_by(email_or_mobile=email_or_mobile).first()

        if user:
            if user.password == password:
                full_name = f"{user.first_name} {user.last_name}"

                # Generate a session cookie value
                unauth_cookie = secrets.token_hex(16)  # Generates a secure random session token

                # Store the session cookie in the database, linking it to the user
                new_session_cookie = SessionCookieUnauth(unauth_cookie=unauth_cookie, user_id=user.id)
                db.session.add(new_session_cookie)
                db.session.commit()

                # Return success with the user's full name and session cookie
                return jsonify({
                    "message": "LOGIN successful",
                      "user": {
                        "id": user.id,  # Include user ID in the response
                        "full_name": full_name
                    },
                    "unauth_cookie": unauth_cookie  # Send session cookie to the client,
                }), 200

            else:
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Server error"}), 500
    





@app.route('/api/get-credentials', methods=['GET'])
def get_credentials():
    try:
        # Retrieve the 'id' from the query parameters
        user_id = request.args.get('id')

        if not user_id:
            return jsonify({"message": "User ID is required"}), 400  # Return an error if no ID is provided

        # Retrieve the user by 'id'
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"message": "User not found"}), 404  # Return an error if user is not found

        # Return the user's first name
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name":user.last_name,
            "email" : user.email_or_mobile,
            "gender":user.gender,
            "birthmonth":user.birth_month,
            "birthday":user.birth_day,
            "birthyear":user.birth_year
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Server error"}), 500

     

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8082)
