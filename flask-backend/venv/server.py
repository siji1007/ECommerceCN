from flask import Flask, jsonify, request
from flask_cors import CORS
from connection import db, init_app
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
import os

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
        vendor_id = vendor.ven_id  # Retrieve the vendor_id
        print(f"Vendor status: {vendor_status}, Vendor ID: {vendor_id}")

        # Include vendor_id in the response
        if vendor_status == 'Pending':
            return jsonify({"message": "Pending", "vendor_id": vendor_id}), 200
        elif vendor_status == 'Verified':
            return jsonify({"message": "Verified", "vendor_id": vendor_id}), 200
        elif vendor_status == 'Rejected':
            return jsonify({"message": "Rejected", "vendor_id": vendor_id}), 200
        else:
            return jsonify({"message": "Unknown vendor status", "vendor_id": vendor_id}), 200

    except Exception as e:
        print(f"Error checking vendor status: {e}")
        return jsonify({"message": "An error occurred while checking the vendor status"}), 500



@app.route('/fetchVendorId/<int:user_id>', methods=['GET', 'OPTIONS'])
def fetch_vendor_id(user_id):
    """
    Fetch the vendor ID associated with the given user ID from the vendors table.
    """
    try:
        print(f"Received request to fetch vendor ID for user_id: {user_id}")
        # Query the Vendor table for the given user_id
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            print("Vendor not found.")
            return jsonify({"message": "Vendor not found"}), 404
        
        # Get the vendor ID and other relevant details if needed
        vendor_id = vendor.ven_id  # Assuming ven_id is the primary key for the vendors table
        print(f"Vendor ID: {vendor_id}")
        
        # Return the vendor ID
        return jsonify({"vendor_id": vendor_id}), 200

    except Exception as e:
        print(f"Error fetching vendor ID: {e}")
        return jsonify({"message": "An error occurred while fetching the vendor ID"}), 500
    


class Product(db.Model):
    __tablename__ = 'products'  # Name of the table in the database

    # Primary Key
    prod_id = db.Column(db.Integer, primary_key=True)

    # Foreign Key
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.ven_id'), nullable=False)

    # Product Attributes
    prod_name = db.Column(db.String(255), nullable=False)
    prod_category = db.Column(db.String(255), nullable=False)
    prod_descript = db.Column(db.Text, nullable=True)
    prod_price = db.Column(db.Float, nullable=False)
    prod_stock = db.Column(db.Integer, nullable=False, default=0)
    prod_disc_price = db.Column(db.Float, nullable=True)
    prod_status = db.Column(db.String(50), nullable=False, default="Pending")
    prod_image_id = db.Column(db.String(255), nullable=False)


    # Relationship with Vendor
    vendor = db.relationship('Vendor', backref=db.backref('products', lazy=True))

    def __init__(self, vendor_id, prod_name, prod_category, prod_descript, prod_price, prod_stock, prod_disc_price, prod_status="Pending", prod_image_id=None):
        self.vendor_id = vendor_id
        self.prod_name = prod_name
        self.prod_category = prod_category
        self.prod_descript = prod_descript
        self.prod_price = prod_price
        self.prod_stock = prod_stock
        self.prod_disc_price = prod_disc_price
        self.prod_status = prod_status
        self.prod_image_id = prod_image_id

    def to_dict(self):
        return {
            "prod_id": self.prod_id,
            "vendor_id": self.vendor_id,
            "prod_name": self.prod_name,
            "prod_category": self.prod_category,
            "prod_descript": self.prod_descript,
            "prod_price": self.prod_price,
            "prod_disc_price": self.prod_disc_price,
            "prod_status": self.prod_status,
            "prod_image_id": self.prod_image_id,
            "prod_stock": self.prod_stock,

        }

@app.route('/addProduct', methods=['POST'])
def add_product():
    try:
        data = request.json
        print("Received data:", data)  # Log the incoming data for debugging
        
        # Extract data from the request
        vendor_id = data.get('vendor_id')
        prod_name = data.get('prod_name')
        prod_category = data.get('prod_category')
        prod_description = data.get('prod_descript')
        prod_price = data.get('prod_price')
        prod_disc_price = data.get('prod_disc_price')
        prod_image_id = data.get('prod_image_id')
        prod_status = data.get('prod_status', 'Pending')
        prod_stock = data.get('prod_stock')

        # Validate required fields
        if not all([vendor_id, prod_name, prod_category, prod_price]):
            return jsonify({"message": "Missing required fields"}), 400

        # Create a new product
        new_product = Product(
            vendor_id=vendor_id,
            prod_name=prod_name,
            prod_category=prod_category,
            prod_descript=prod_description,
            prod_price=prod_price,
            prod_disc_price=prod_disc_price,
            prod_status=prod_status,
            prod_image_id=prod_image_id,
            prod_stock= prod_stock,
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully", "product_id": new_product.prod_id}), 201
    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({"message": f"An error occurred: {e}"}), 500



# Folder where you want to store uploaded images
UPLOAD_FOLDER = r'C:/Users/XtiaN//ECommerceCN/src/assets/product_images' 
#                 C:\Users\XtiaN\ECommerceCN\src\assets\product_images

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Check allowed extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to upload image
@app.route('/uploadProductImage', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Return the URL to the image to be displayed in React
        return jsonify({'imageUrl': f'http://192.168.1.8:5173/src/assets/product_images/{filename}'}), 200

    return jsonify({'message': 'Invalid file format'}), 400

# Route to serve the images
@app.route('/assets/product_images/<filename>')
def uploaded_file(filename):
    # Serve the image from the directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/deleteProductImage/<filename>', methods=['DELETE'])
def delete_image(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            os.remove(file_path)  # Delete the file from server
            return jsonify({"message": f"Image {filename} deleted successfully."}), 200
        else:
            return jsonify({"message": f"Image {filename} not found."}), 404
    except Exception as e:
        return jsonify({"message": f"Error deleting image: {str(e)}"}), 500



@app.route('/FetchProducts/<int:vendor_id>', methods=['GET'])
def get_products_by_vendor(vendor_id):
    try:
        # Fetch products based on vendor_id
        products = Product.query.filter_by(vendor_id=vendor_id).all()
        
        if not products:
            return jsonify({'message': 'No products found for this vendor.'}), 404
        
        # Serialize products
        products_list = [
            {
                'prod_id': product.prod_id,
                'vendor_id': product.vendor_id,
                'prod_name': product.prod_name,
                'prod_category': product.prod_category,
                'prod_descript': product.prod_descript,
                'prod_price': product.prod_price,
                'prod_disc_price': product.prod_disc_price,
                'prod_status': product.prod_status,
                'prod_image_id': product.prod_image_id,
                'prod_stock' : product.prod_stock,
            }
            for product in products
        ]
        print(products_list)
        return jsonify({'products': products_list}), 200



    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/FetchProducts', methods=['GET'])
def get_all_products():
    try:
        # Fetch all products (no filtering by vendor_id)
        products = Product.query.all()
        
        if not products:
            return jsonify({'message': 'No products found.'}), 404
        
        # Serialize products
        products_list = [
            {
                'prod_id': product.prod_id,
                'vendor_id': product.vendor_id,
                'prod_name': product.prod_name,
                'prod_category': product.prod_category,
                'prod_descript': product.prod_descript,
                'prod_price': product.prod_price,
                'prod_disc_price': product.prod_disc_price,
                'prod_status': product.prod_status,
                'prod_image_id': product.prod_image_id,
                'prod_stock' : product.prod_stock,
            }
            for product in products
        ]
        print(products_list)
        return jsonify({'products': products_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


    except Exception as e:
        return jsonify({'error': str(e)}), 500


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8082)

