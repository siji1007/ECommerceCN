from flask import Flask, jsonify, request
from flask_cors import CORS
from connection import db, init_app
import secrets
from datetime import datetime

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
        self.birth_year = birth_year
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




# Define the Vendor model based on the table structure
class Vendor(db.Model):
    __tablename__ = 'vendors'
    ven_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)  # Assuming you have a user_id, modify as needed
    vendor_name = db.Column(db.String(255))
    vendor_contact_number = db.Column(db.String(50))
    vendor_email = db.Column(db.String(100))
    vendor_classification = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    vendor_status = db.Column(db.String(50), default='Pending')

@app.route('/submit-form-vendor/<int:user_id>', methods=['POST'])
def submit_form(user_id):
    form_data = request.json  # Parse the JSON payload
    print("Received form data:", form_data)  # Print to console
    
    if not user_id:
        return jsonify({"message": "User ID is required!"}), 400

    # Fetch user email as default for businessEmail if not provided
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404

    business_email = form_data.get('businessEmail', user.email_or_mobile)

    existing_vendor = Vendor.query.filter_by(vendor_email=business_email).first()
    if existing_vendor:
        return jsonify({"message": "Email already exists. Please use a different email address."}), 400

    # Create a new vendor instance with form data
    new_vendor = Vendor(
        user_id=user_id,  # Use the user_id from the URL
        vendor_name=form_data['businessName'],
        vendor_contact_number=form_data['businessContact'],
        vendor_email=form_data['businessEmail'],
        vendor_classification=form_data['businessCategory'],
        created_at=datetime.utcnow(),
        vendor_status='Pending'
    )

    # Add the new vendor to the session and commit to the database
    try:
        db.session.add(new_vendor)
        db.session.commit()
        return jsonify({"message": "Form data submitted and vendor added successfully!"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"Error inserting data: {e}")
        return jsonify({"message": "An error occurred while submitting the form!"}), 500
    

@app.route('/fetchEmail/<int:user_id>', methods=['GET'])
def fetch_email_by_default(user_id):
    try:
        # Query the User table by user_id
        user = User.query.filter_by(id=user_id).first()

        # Check if the user exists
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Return the user's email
        return jsonify({
            "user_id": user.id,
            "email": user.email_or_mobile  # Assuming email_or_mobile stores the user's email
        }), 200

    except Exception as e:
        print(f"Error fetching email: {e}")
        return jsonify({"message": "An error occurred while fetching the email"}), 500
    

@app.route('/checkVendorStatus/<int:user_id>', methods=['GET', 'OPTIONS'])
def check_vendor_status(user_id):
    try:
        print(f"Received request to check vendor status for user_id: {user_id}")
        
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        print(f"Vendor query result: {vendor}")

        if not vendor:
            print("Vendor not found.")
            return jsonify({"message": "Vendor not found"}), 404

        vendor_status = vendor.vendor_status
        print(f"Vendor status: {vendor_status}")

        if vendor_status == 'Pending':
            return jsonify({"message": "Pending"}), 200
        elif vendor_status == 'Verified':
            return jsonify({"message": "Verified"}), 200
        elif vendor_status == 'Rejected':
            return jsonify({"message": "Rejected"}), 200
        else:
            return jsonify({"message": "Unknown vendor status"}), 200

    except Exception as e:
        print(f"Error checking vendor status: {e}")
        return jsonify({"message": "An error occurred while checking the vendor status"}), 500


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8082)

