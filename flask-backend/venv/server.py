from flask import Flask, jsonify, request, session
from flask_cors import CORS
from requests import Session
from connection import db, init_app
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import time
from sqlalchemy.exc import SQLAlchemyError


app = Flask(__name__)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": ["https://192.168.1.7:5173", "https://192.168.1.7:8082"]}})



init_app(app)

app.config['DEBUG'] = True


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
    user_id = session.get('user_id')  # Get the user ID from Flask session

    if unauth_cookie and user_id:
        # Check if the cookie already exists
        existing_cookie = SessionCookieUnauth.query.filter_by(user_id=user_id).first()
        if existing_cookie:
            existing_cookie.unauth_cookie = unauth_cookie
        else:
            new_cookie = SessionCookieUnauth(unauth_cookie=unauth_cookie, user_id=user_id)
            db.session.add(new_cookie)
        db.session.commit()
        return jsonify({"message": "Cookie stored successfully"}), 201
    return jsonify({"message": "Invalid request"}), 400

@app.before_request
def check_cookie():
    if 'unauth_cookie' in request.cookies:
        cookie_value = request.cookies['unauth_cookie']
        print(f"Received cookie: {cookie_value}")  # Debugging line
        stored_cookie = SessionCookieUnauth.query.filter_by(unauth_cookie=cookie_value).first()
        if not stored_cookie:
            print("Session expired or invalid cookie")  # Debugging line
            return jsonify({"message": "Session expired, please log in again"}), 401
    else:
        print("No unauth_cookie found in request")

from flask import Flask, request, jsonify, make_response



@app.route('/api/get-current-session', methods=['GET'])
def get_current_session():
    session_cookie = request.cookies.get('unauth_cookie')
    
    if session_cookie:
        session = SessionCookieUnauth.query.filter_by(unauth_cookie=session_cookie).first()
        if session:
            user = User.query.filter_by(id=session.user_id).first()
            if user:
                full_name = f"{user.first_name} {user.last_name}"
                return jsonify({
                    'session_cookie': session.unauth_cookie,
                    'user_id': session.user_id,
                    'full_name': full_name,
                }), 200

    # Delete the unauth_cookie if the session is invalid or missing
    response = make_response(jsonify({'message': 'No active session found'}), 401)
    response.delete_cookie('unauth_cookie', path='/')  # Specify the path
    return response


@app.route('/api/logout', methods=['POST'])
def logout():
    session_cookie = request.cookies.get('unauth_cookie')
    if session_cookie:
        session = SessionCookieUnauth.query.filter_by(unauth_cookie=session_cookie).first()
        if session:
            # Delete the session or mark it as invalid
            db.session.delete(session)
            db.session.commit()
            response = jsonify({'success': True, 'message': 'Logged out successfully'})
            response.delete_cookie('unauth_cookie')  # Remove the session cookie from the browser
            return response
    return jsonify({'success': False, 'message': 'No active session found'}), 401



class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_fname = db.Column(db.String(255))  
    admin_lname = db.Column(db.String(255))  
    admin_bmonth = db.Column(db.String(50)) 
    admin_bday = db.Column(db.Integer)  
    admin_byear = db.Column(db.Integer)  
    admin_email = db.Column(db.String(100), unique=True, nullable=False)  
    admin_password = db.Column(db.String(255))  

    def __init__(self, admin_fname, admin_lname, admin_bmonth, admin_bday, admin_byear, admin_email, admin_password):
        self.admin_fname = admin_fname
        self.admin_lname = admin_lname
        self.admin_bmonth = admin_bmonth
        self.admin_bday = admin_bday
        self.admin_byear = admin_byear
        self.admin_email = admin_email
        self.admin_password = admin_password  

    def __repr__(self):
        return f"<Admin {self.admin_fname} {self.admin_lname} ({self.admin_email})>"
    
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data['emailOrMobile']
    password = data['password']
    
   
    admin = Admin.query.filter_by(admin_email=email).first()

    if admin and admin.admin_password == password:  
        return jsonify({
            'message': 'Login successful',
            'admin': {
                'admin_id': admin.admin_id,
                'admin_fname': admin.admin_fname,
                'admin_lname': admin.admin_lname
            }
        }), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401



# Define the User model (already provided in your case)



@app.route('/api/users', methods=['GET'])
def get_users():
    # Query all users from the database
    users = User.query.all()
    
    # Format the result to match the data structure needed by React
    users_data = [
        {
            "id": user.id,
            "user_img": user.user_image,
            "fullName": f"{user.first_name} {user.last_name}",
            "Gender": user.gender,
            "status": "Active",  # Customize based on your business logic
            "email": user.email_or_mobile,
            "role": "Member",  # Customize based on roles logic
        }
        for user in users
    ]
    
    return jsonify(users_data)








PROFILE_IMAGES_FOLDER = r"C:\Users\XtiaN\ECommerceCN\src\assets\profiles"

# Ensure the directory exists, create it if it doesn't
if not os.path.exists(PROFILE_IMAGES_FOLDER):
    os.makedirs(PROFILE_IMAGES_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/uploadProfileImage', methods=['POST'])
def upload_profile_image():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(PROFILE_IMAGES_FOLDER, filename)
        file.save(file_path)

        # Get the URL of the uploaded image
        image_url = f'/src/assets/profiles/{filename}'

        # Get the user_id from the request
        user_id = request.form.get('user_id')

        if user_id:
            # Query the user from the database based on the user_id
            user = User.query.get(user_id)
            if user:
                # Update the user's image URL in the database
                user.user_image = image_url  # Save the URL in the user_image column
                db.session.commit()  # Commit the changes to the database

                return jsonify({'message': 'Image uploaded and user image URL updated', 'imageUrl': image_url}), 200
            else:
                return jsonify({'message': 'User not found'}), 404
        else:
            return jsonify({'message': 'User ID not provided'}), 400

    return jsonify({'message': 'Invalid file format'}), 400


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
    document_img_src = db.Column(db.String(255))
   


@app.route('/api/fetchVendors', methods=['GET'])
def fetchvendors():
    try:
        # Get the status query parameter (if provided)
        status = request.args.get('status')

        # If status is provided, filter vendors by that status
        if status:
            vendors = Vendor.query.filter_by(vendor_status=status).all()
        else:
            # If no status is provided, fetch all vendors
            vendors = Vendor.query.all()

        # Format the data as a list of dictionaries
        vendor_list = []
        for vendor in vendors:
            vendor_data = {
                "ven_id": vendor.ven_id,
                "user_id": vendor.user_id,
                "vendor_name": vendor.vendor_name,
                "vendor_contact_number": vendor.vendor_contact_number,
                "vendor_email": vendor.vendor_email,
                "vendor_classification": vendor.vendor_classification,
                "created_at": vendor.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "vendor_status": vendor.vendor_status
            }
            vendor_list.append(vendor_data)

        # Return the JSON response
        return jsonify(vendor_list), 200

    except Exception as e:
        # Handle exceptions and return error message
        return jsonify({"error": str(e)}), 500








@app.route('/get_vendor_by_user_id', methods=['GET'])
def get_vendor_by_user_id():
    user_id = request.args.get('user_id')
    vendor = Vendor.query.filter_by(user_id=user_id).first()  # Query vendor table
    if vendor:
        return jsonify({'ven_id': vendor.ven_id})
    return jsonify({'error': 'Vendor not found'}), 404


@app.route('/api/updateVendorStatus', methods=['POST'])
def update_vendor_status():
    try:
        data = request.json
        ven_id = data.get('ven_id')
        new_status = data.get('vendor_status')

        if not ven_id or not new_status:
            return jsonify({'error': 'Missing ven_id or vendor_status'}), 400

        # Find the vendor by ID
        vendor = Vendor.query.filter_by(ven_id=ven_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404

        # Update the status
        vendor.vendor_status = new_status
        db.session.commit()

        return jsonify({'message': 'Vendor status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


VENDOR_DOCUMENTS_FOLDER = r"C:\Users\XtiaN\ECommerceCN\src\assets\documentsImages"

# Ensure the directory exists, create it if it doesn't
if not os.path.exists(VENDOR_DOCUMENTS_FOLDER):
    os.makedirs(VENDOR_DOCUMENTS_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'docx'}

# Function to validate file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS




global_document_url = None

def handle_image_upload(file):
    global global_document_url
    """
    Handles the image upload and saves it with the original filename.
    """
    document_url = None  # Default value
    
    if file and allowed_file(file.filename):
        # Sanitize the filename to avoid issues with special characters
        filename = secure_filename(file.filename)
        
        # Define the path where the file will be saved
        file_path = os.path.join(VENDOR_DOCUMENTS_FOLDER, filename)
        
        # Save the file to the desired path
        try:
            file.save(file_path)
            print(f"File saved at: {file_path}")  # Prints the full file path

            # Assuming you're returning a relative URL for front-end access
            document_url = f'/src/assets/documentsImages/{filename}'
            global_document_url = document_url
            print("This is the image url: ", document_url)

        except Exception as e:
            print(f"Error saving file: {e}")

    return document_url  # Return None if file is invalid or error occurs


# Image upload route
@app.route('/UploadDocument', methods=['POST'])
def UploadDocument():
   
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    
    # If no file is selected, return an error
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    # Call the function to handle file upload
    document_url = handle_image_upload(file)
    
    if document_url:
        return jsonify({"message": "File uploaded successfully", "document_url": document_url}), 200
    
    return jsonify({"message": "File type not allowed"}), 400

# Form submission route for vendor data
@app.route('/submit-form-vendor/<int:user_id>', methods=['POST'])
def submit_form(user_id):
    form_data = request.form  # Parse form data
    print("Received form data:", form_data)

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

    # Check if file is included in the form request
   

    # Create a new vendor instance with form data and the uploaded document URL
    new_vendor = Vendor(
        user_id=user_id,  # Use the user_id from the URL
        vendor_name=form_data['businessName'],
        vendor_contact_number=form_data['businessContact'],
        vendor_email=form_data['businessEmail'],
        vendor_classification=form_data['businessCategory'],
        created_at=datetime.utcnow(),
        vendor_status='Pending',
        document_img_src=global_document_url  # Use the document URL obtained from the upload
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

    # Set user_image to None (will be saved as NULL in the database)
    user_image = None

    # Create a new user object
    user = User(
        first_name=first_name,
        last_name=last_name,
        birth_month=birth_month,
        birth_day=birth_day,
        birth_year=birth_year,
        gender=gender,
        email_or_mobile=email_or_mobile,
        password=password,
        user_image=user_image
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
            "birthyear":user.birth_year,
            "user_image":user.user_image,
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Server error"}), 500




@app.route('/api/fetchSpecificVendor', methods=['GET'])
def fetch_specific_vendor():
    # Get the vendor_id from the query string or request arguments
    vendor_id = request.args.get('vendor_id', type=int)

    if not vendor_id:
        return jsonify({'message': 'Vendor ID is required'}), 400
    
    # Query the database for the specific vendor
    vendor = Vendor.query.get(vendor_id)
    
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404
    
    # Return the vendor details in a JSON response
    return jsonify({
        'ven_id': vendor.ven_id,
        'vendor_name': vendor.vendor_name,
        'vendor_contact_number': vendor.vendor_contact_number,
        'vendor_email': vendor.vendor_email,
        'vendor_classification': vendor.vendor_classification,
        'created_at': vendor.created_at,
        'vendor_status': vendor.vendor_status
    }), 200

@app.route('/api/vendor/<int:vendor_id>', methods=['GET'])
def get_vendor(vendor_id):
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'message': 'Vendor not found'}), 404
        return jsonify({
            'ven_id': vendor.ven_id,
            'vendor_name': vendor.vendor_name,
            # 'image_url': vendor.image_url,  # Make sure image_url is available
            'vendor_contact_number': vendor.vendor_contact_number,
            'vendor_email': vendor.vendor_email,
            'vendor_classification': vendor.vendor_classification,
            'created_at': vendor.created_at,
            'vendor_status': vendor.vendor_status
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/vendorDetails/<int:id>', methods=['GET'])
def get_vendor_details(id):
    vendor = Vendor.query.get(id)
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404

    return jsonify({
        "ven_id": vendor.ven_id,
        "vendor_name": vendor.vendor_name,
        "vendor_contact_number": vendor.vendor_contact_number,
        "vendor_email": vendor.vendor_email,
        "vendor_classification": vendor.vendor_classification,
        "created_at": vendor.created_at,
        "vendor_status": vendor.vendor_status,
        "document_img_src": vendor.document_img_src,
    })




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



@app.route('/api/fetchVendorStatus/<int:vendor_id>', methods=['GET'])
def fetch_vendor_status(vendor_id):
    try:
        # Assuming you are querying the Vendor table to get the vendor status
        vendor = Vendor.query.get(vendor_id)
        
        if not vendor:
            return jsonify({"message": "Vendor not found."}), 404
        
        status = vendor.vendor_status 
        
        return jsonify({"vendor_id": vendor_id, "status": status}), 200
    
    except Exception as e:
        print(f"Error fetching status for vendor {vendor_id}: {e}")
        return jsonify({"message": "An error occurred while fetching the vendor status."}), 500


@app.route('/api/fetchVendorId/<int:user_id>', methods=['GET', 'OPTIONS'])
def fetch_vendor_id(user_id):
    try:
        print(f"Received request to fetch vendor ID for user_id: {user_id}")
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            print("Vendor not found.")
            return jsonify({"message": "Vendor not found"}), 404
        
        vendor_id = vendor.ven_id  # Assuming ven_id is the primary key for the vendors table
        print(f"Vendor ID: {vendor_id}")
        
        return jsonify({"vendor_id": vendor_id}), 200

    except Exception as e:
        print(f"Error fetching vendor ID: {e}")
        return jsonify({"message": "An error occurred while fetching the vendor ID"}), 500



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
        return jsonify({'imageUrl': f'/src/assets/product_images/{filename}'}), 200

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
                'vendor_name': product.vendor.vendor_name if product.vendor else None,
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
                'vendor_name': product.vendor.vendor_name if product.vendor else None,
                'prod_category': product.prod_category,
                'prod_name':product.prod_name,
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


@app.route('/DeleteProduct/<int:prod_id>', methods=['DELETE'])
def delete_product(prod_id):
    try:
        # Fetch the product using the provided prod_id
        product = Product.query.filter_by(prod_id=prod_id).first()
        if not product:
            return jsonify({'message': 'Product not found.'}), 404

        # Check for dependent transactions
        dependent_transactions = Transaction.query.filter_by(p_ID=prod_id).all()
        if dependent_transactions:
            # Handle dependent transactions, either delete or update them
            for transaction in dependent_transactions:
                # Example: Update the transaction or delete it
                transaction.p_ID = None  # Or you can delete the transaction
                db.session.delete(transaction)

        # Delete the product from the database
        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully.'}), 200

    except Exception as e:
        db.session.rollback()  # Rollback the session in case of error
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/updateProduct/<int:prod_id>', methods=['PUT'])
def update_product(prod_id):
    try:
        # Fetch the product from the database by ID
        product = Product.query.get(prod_id)
        
        if not product:
            return jsonify({'message': 'Product not found.'}), 404
        
        # Get the updated product data from the request body
        data = request.get_json()
        
        # Log the received data for debugging
        print("Received data:", data)  # Ensure prod_category is included

        # Update product fields
        product.prod_name = data.get('prod_name', product.prod_name)
        product.prod_price = data.get('prod_price', product.prod_price)
        product.prod_category = data.get('prod_category', product.prod_category)  # Update category
        product.prod_descript = data.get('prod_descript', product.prod_descript)
        product.prod_stock = data.get('prod_stock', product.prod_stock)
        
        # Check if there's a new image ID and update it
        prod_image_id = data.get('prod_image_id')
        if prod_image_id:
            product.prod_image_id = prod_image_id  # Update the image ID if provided
        
        # Commit the changes to the database
        db.session.commit()

        # Log the updated product to verify changes
        print(f"Product {prod_id} updated: {product.prod_category}")

        return jsonify({'message': 'Product updated successfully.'}), 200

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({'error': str(e)}), 500






@app.route('/delete-cart-item/<int:cart_id>', methods=['DELETE'])
def delete_cart_item(cart_id):
    start_time = time.time()

    # ORM query
    cart_item = Cart.query.filter_by(cart_id=cart_id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    end_time = time.time()
    execution_time = end_time - start_time
    return jsonify({'message': 'Cart item deleted successfully', 'execution_time': execution_time}), 200


class Cart(db.Model):
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    us_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer,db.ForeignKey('products.prod_id', ondelete='CASCADE'), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    product_classification = db.Column(db.String(255), nullable=True)
    product_quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    

@app.route('/api/cart/check', methods=['POST'])
def check_cart_product():
    data = request.get_json()
    us_id = data.get('us_id')
    product_id = data.get('product_id')
    
    # Query cart for the product and user
    cart_item = Cart.query.filter_by(us_id=us_id, product_id=product_id).first()
    if cart_item:
        return jsonify({'found': True}), 200
    else:
        return jsonify({'found': False}), 404


@app.route('/api/cart/update', methods=['POST'])
def update_cart():
    try:
        data = request.get_json()

        # Extract data from the request body
        us_id = data.get('us_id')
        cart_id = data.get('cart_id')  # We are using cart_id to find the item
        product_quantity = data.get('product_quantity')
        total_price = data.get('total_price')  # The updated total price

        # Ensure required fields are provided
        if not all([us_id, cart_id, product_quantity, total_price]):
            return jsonify({'message': 'Missing required fields'}), 400

        # Debugging: Log the values you're searching for
        print(f"Looking for cart item with us_id: {us_id} and cart_id: {cart_id}")

        # Find the cart item based on cart_id
        cart_item = Cart.query.filter_by(cart_id=cart_id, us_id=us_id).first()

        if cart_item:
            # If the cart item exists, update the quantity and total price
            cart_item.product_quantity = product_quantity
            cart_item.total_price = total_price  # Update total price

            # Commit changes to the database
            db.session.commit()

            return jsonify({'message': 'Cart item quantity and total price updated successfully!'}), 200
        else:
            # Cart item not found
            return jsonify({'message': 'Product not found in cart'}), 404

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


    
@app.route('/api/cart/<int:us_id>', methods=['GET'])
def fetch_user_cart(us_id):
    try:
        # Query to fetch cart items for the specific user ID, along with product details (including the image and vendor details)
        cart_items = db.session.query(Cart, Product, Vendor).join(Product, Cart.product_id == Product.prod_id) \
            .join(Vendor, Product.vendor_id == Vendor.ven_id) \
            .filter(Cart.us_id == us_id).all()

        # Check if the user has items in the cart
        if not cart_items:
            return jsonify({'message': 'No cart items found for this user'}), 404

        # Serialize the cart items into a list of dictionaries, including the product image, vendor_id, and vendor_name
        cart_data = [
            {
                'cart_id': item.Cart.cart_id,
                'product_id': item.Cart.product_id,
                'product_name': item.Cart.product_name,
                'product_classification': item.Cart.product_classification,
                'product_quantity': item.Cart.product_quantity,
                'unit_price': item.Product.prod_price,
                'DicountedPrice':item.Product.prod_disc_price,
                'total_price': item.Cart.total_price,
                'date_added': item.Cart.date_added.strftime('%Y-%m-%d %H:%M:%S'),
                'product_image': item.Product.prod_image_id, 
                'vendor_id': item.Product.vendor_id, 
                'vendor_name': item.Vendor.vendor_name  
            }
            for item in cart_items
        ]

        return jsonify({'message': 'Cart items fetched successfully', 'cart_items': cart_data}), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500









@app.route('/api/transactions/<int:user_id>/to_pay', methods=['GET'])
def get_to_pay_transactions(user_id):
    transactions = Transaction.query.filter_by(u_ID=user_id, status='processing').all()
    return jsonify([
        {
            'transaction_id': t.transaction_id,
            'product_id': t.p_ID,
            'quantity': t.quantity,
            'unit_price': t.unit_price,
            'subtotal': t.subtotal,
            'created_at': t.created_at,
            'status': t.status,
            'product_image': t.product.prod_image_id,  # Access Product model's image ID
            'product_name': t.product.prod_name,
            'product_category': t.product.prod_category
        }
        for t in transactions
    ])


@app.route('/api/transactions/<int:user_id>/to_receive', methods=['GET'])
def get_to_receive_transactions(user_id):
    transactions = Transaction.query.filter_by(u_ID=user_id, status='processed').all()
    return jsonify([
        {
            'transaction_id': t.transaction_id,
            'product_id': t.p_ID,
            'quantity': t.quantity,
            'unit_price': t.unit_price,
            'subtotal': t.subtotal,
            'created_at': t.created_at,
            'status': t.status,
            'product_image': t.product.prod_image_id,
            'product_name': t.product.prod_name,
            'product_category': t.product.prod_category
        }
        for t in transactions
    ])




@app.route('/api/create_transaction', methods=['POST'])
def create_transaction():
    data = request.get_json()  # Get the data from the request body

    # Get the payment method from the front end (either 'COD' or 'POD')
    payment = data['paymentMethod']  # Make sure the front end sends this

    # Validate payment method

    # Loop through the selected products to insert them into the transaction table
    for product in data['selectedProductDetails']:
        # Create a new transaction entry with vendor_id
        new_transaction = Transaction(
            u_ID=data['userId'],  # User ID passed from the front end
            p_ID=product['productId'],  # Product ID
            v_ID=product['vendorId'],  # Add vendor ID from the product
            quantity=product['quantity'],
            unit_price=product['unitPrice'],
            subtotal=product['subtotal'],
            payment=data['paymentMethod'] ,  # Add payment method to transaction
            status='processing'  # Status can be 'processing' or 'processed'
        )

        db.session.add(new_transaction)

    db.session.commit()  # Commit the transaction to the database

    return jsonify({"message": "Transaction created successfully!"}), 201




@app.route('/fetchTransactionsAll', methods=['GET'])
def fetch_transactionsall():
    # Fetch all transactions where the status is 'processed'
    transactions = Transaction.query.filter_by(status='processed').all()

    # Aggregate quantities by product ID
    product_quantities = {}
    transaction_details = []

    for transaction in transactions:
        if transaction.p_ID in product_quantities:
            product_quantities[transaction.p_ID] += transaction.quantity
        else:
            product_quantities[transaction.p_ID] = transaction.quantity

        # Get user information
        user = User.query.get(transaction.u_ID)
        product = Product.query.get(transaction.p_ID)

        # Store the transaction details (User, Product, and Transaction)
        transaction_details.append({
            'transaction_id': transaction.transaction_id,
            'user_name': user.first_name if user else 'Unknown',  # Assuming user has a 'name' attribute
            'product_name': product.prod_name if product else 'Unknown',
            'created_at': transaction.created_at,
            'payment': transaction.payment
        })

    # Prepare the response with both product quantities and transaction details
    result = {
        'product_quantities': [{
            'product_id': product.prod_id,
            'product_name': product.prod_name,
            'total_quantity': product_quantities[product.prod_id]
        } for product in Product.query.all() if product.prod_id in product_quantities],
        'transaction_details': transaction_details
    }

    return jsonify(result)



class Product(db.Model):
    __tablename__ = 'products'  # Name of the table in the database
    prod_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.ven_id'), nullable=False)
    prod_name = db.Column(db.String(255), nullable=False)
    prod_category = db.Column(db.String(255), nullable=False)
    prod_descript = db.Column(db.Text, nullable=True)
    prod_price = db.Column(db.Float, nullable=False)
    prod_stock = db.Column(db.Integer, nullable=False, default=0)
    prod_disc_price = db.Column(db.Float, nullable=True)
    prod_status = db.Column(db.String(50), nullable=False, default="Pending")
    prod_image_id = db.Column(db.String(255), nullable=False)
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
            "vendor_name": self.vendor.vendor_name if self.vendor else None,
            "prod_name": self.prod_name,
            "prod_category": self.prod_category,
            "prod_descript": self.prod_descript,
            "prod_price": self.prod_price,
            "prod_disc_price": self.prod_disc_price,
            "prod_status": self.prod_status,
            "prod_image_id": self.prod_image_id,
            "prod_stock": self.prod_stock,

        }
    




@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()

        # Extracting data from the request
        us_id = data.get('us_id')
        product_id = data.get('product_id')
        product_name = data.get('product_name')
        product_classification = data.get('product_classification')
        product_quantity = data.get('product_quantity')
        total_price = data.get('total_price')

        # Validate required fields
        if not all([us_id, product_id, product_name, product_quantity, total_price]):
            return jsonify({'message': 'Missing required fields'}), 400

        # Check if the product is already in the cart
        existing_cart_item = Cart.query.filter_by(us_id=us_id, product_id=product_id).first()
        if existing_cart_item:
            return jsonify({'message': 'You already have this product in your cart!'}), 400

        # Create a new cart record
        new_cart = Cart(
            us_id=us_id,
            product_id=product_id,
            product_name=product_name,
            product_classification=product_classification,
            product_quantity=product_quantity,
            total_price=total_price
        )

        # Add and commit to the database
        db.session.add(new_cart)
        db.session.commit()

        return jsonify({'message': 'Product added to cart successfully!'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


    

class Transaction(db.Model):
    __tablename__ = 'transactions'

    transaction_id = db.Column(db.Integer, primary_key=True)
    
    u_ID = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    p_ID = db.Column(db.Integer, db.ForeignKey('products.prod_id', ondelete='CASCADE'), nullable=False)  # Correct foreign key reference
    v_ID = db.Column(db.Integer, db.ForeignKey('vendors.ven_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False)
    payment = db.Column(db.String(20), nullable=False)

    # Relationship to Product
    product = db.relationship('Product', backref='transactions', lazy='joined')  # Use joined loading here
    # Relationship to Vendor
    vendor = db.relationship('Vendor', backref='transactions')


@app.route('/update_transaction_status', methods=['POST'])
def update_transaction_status():
    try:
        data = request.json  # Get the JSON payload from the request
        transaction_id = data.get('transaction_id')
        status = data.get('status')

        # Validate input
        if not transaction_id or not status:
            return jsonify({'error': 'Missing transaction_id or status'}), 400

        # Fetch the transaction from the database
        transaction = Transaction.query.filter_by(transaction_id=transaction_id).first()
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404

        # Update the transaction status
        transaction.status = status
        
        # Deduct the quantity from the product stock if the status is 'processed'
        if status == 'processed':
            # Fetch the product associated with the transaction
            product = transaction.product

            if product:
                # Ensure product stock is sufficient
                if product.prod_stock >= transaction.quantity:
                    # Deduct the quantity from the product stock
                    product.prod_stock -= transaction.quantity
                    db.session.commit()  # Save changes to the product stock
                else:
                    return jsonify({'error': 'Insufficient stock for the product'}), 400
            else:
                return jsonify({'error': 'Product not found'}), 404

        # Commit the transaction status update
        db.session.commit()  # Save the changes to the transaction status

        return jsonify({'message': 'Transaction status and stock updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/get_user_by_id', methods=['GET'])
def get_user_by_id():
    u_id = request.args.get('u_id')
    if not u_id:
        return jsonify({'error': 'u_id is required'}), 400
    user = User.query.filter_by(id=u_id).first()
    if user:
        return jsonify({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email_or_mobile
        })
    return jsonify({'error': 'User not found'}), 404





@app.route('/fetchTransactions/<int:vendor_id>', methods=['GET'])
def fetch_transactions(vendor_id):
    transactions = Transaction.query.filter_by(v_ID=vendor_id, status='processed').all()

  
    return jsonify([{
        'transaction_id': transaction.transaction_id,
        'u_ID': transaction.u_ID,
        'p_ID': transaction.p_ID,
        'v_ID': transaction.v_ID,
        'quantity': transaction.quantity,
        'unit_price': transaction.unit_price,
        'subtotal': transaction.subtotal,
        'created_at': transaction.created_at,
        'status': transaction.status,
        'payment': transaction.payment,
        'prod_disc_price': transaction.product.prod_disc_price if transaction.product else None
    } for transaction in transactions])










# Example Flask API to fetch transactions by v_ID
@app.route('/get_transactions_by_vendor', methods=['GET'])
def get_transactions_by_vendor():
    ven_id = request.args.get('ven_id')
    transactions = Transaction.query.filter_by(v_ID=ven_id, status="Processing").all()  # Filter by status "Processing"
    
    if transactions:
        # Format the response to send relevant details
        transaction_details = [{
            'transaction_id': transaction.transaction_id,
            'u_ID': transaction.u_ID,
            'p_ID': transaction.p_ID,
            'quantity':transaction.quantity,
            'subtotal':transaction.subtotal,
            'created_at':transaction.created_at,
            'payment':transaction.payment,
            'unit_price':transaction.unit_price,

            'status': transaction.status
        } for transaction in transactions]
        
        return jsonify(transaction_details)
    
    return jsonify({'error': 'No processing transactions found for this vendor'}), 404


@app.route('/get_product_by_id', methods=['GET'])
def get_product_by_id():
    p_id = request.args.get('p_id')  # Get the p_id from the query parameters
    
    if not p_id:
        return jsonify({'error': 'Product ID is required'}), 400
    
    # Query the product by prod_id (assuming your Product model is correctly set up)
    product = Product.query.filter_by(prod_id=p_id).first()
    
    if product:
        # Return the product details if found
        product_details = {
            'prod_name': product.prod_name,
            'prod_category': product.prod_category,
            'prod_image_id': product.prod_image_id,
            'prod_disc_price': product.prod_disc_price
        }
        return jsonify(product_details)
    
    return jsonify({'error': 'Product not found'}), 404


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Delete associated data (like addresses)
        Address.query.filter_by(u_id=user.id).delete()
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500





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
    user_image = db.Column(db.String(255))

    def __init__(self, first_name, last_name, birth_month, birth_day, birth_year, gender, email_or_mobile, password, user_image):
        self.first_name = first_name
        self.last_name = last_name
        self.birth_month = birth_month
        self.birth_day = birth_day
        self.birth_year = birth_year
        self.gender = gender
        self.email_or_mobile = email_or_mobile
        self.password = password
        self.user_image = user_image


class Address(db.Model):
    __tablename__ = 'addresses'

    addr_id = db.Column(db.Integer, primary_key=True)
    u_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Corrected ForeignKey reference to 'users.id'
    province = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    barangay = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
 

    # Relationship to User (backref to access user from address)
    user = db.relationship('User', backref='addresses', lazy=True)

    def __init__(self, u_id, province, city, barangay, postal_code, latitude, longitude):
        self.u_id = u_id
        self.province = province
        self.city = city
        self.barangay = barangay
        self.postal_code = postal_code
        self.latitude = latitude
        self.longitude = longitude


@app.route('/api/addresses', methods=['GET'])
def get_all_addresses():
    try:
        addresses = Address.query.join(User, Address.u_id == User.id).all()  # Join Address with User on u_id
        addresses_data = [
            {
                'addr_id': address.addr_id,
                'u_id': address.u_id,
                'first_name': address.user.first_name,  # Fetch the first_name from the User model
                'last_name':address.user.last_name,
                'user_image':address.user.user_image,
                'province': address.province,
                'city': address.city,
                'barangay': address.barangay,
                'postal_code': address.postal_code,
                'latitude': address.latitude,
                'longitude': address.longitude,
            }
            for address in addresses
        ]
        return jsonify(addresses_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/addresses/<int:u_id>', methods=['GET'])
def check_address_existence(u_id):
    address = Address.query.filter_by(u_id=u_id).first()
    if address:
        return jsonify({'exists': True, 'address': {
            'addr_id': address.addr_id,
            'u_id': address.u_id,
            'province': address.province,
            'city': address.city,
            'barangay': address.barangay,
            'postal_code': address.postal_code,
            'latitude': address.latitude,
            'longitude': address.longitude,
          
        }}), 200
    else:
        return jsonify({'exists': False}), 404



@app.route('/api/addresses', methods=['POST'])
def save_address():
    data = request.get_json()

    # Validate that u_id is in the data
    u_id = data.get('u_id')
    if not u_id:
        return jsonify({'message': 'User ID is required'}), 400

    # Create a new Address
    new_address = Address(
        u_id=u_id,
        province=data.get('province'),
        city=data.get('city'),
        barangay=data.get('barangay'),
        postal_code=data.get('postal_code'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )

    db.session.add(new_address)
    db.session.commit()
    return jsonify({'message': 'Address saved successfully!'}), 201

@app.route('/api/addresses/<int:u_id>', methods=['PUT'])
def update_address(u_id):
    data = request.get_json()

    address = Address.query.filter_by(u_id=u_id).first()
    if address:
        address.province = data.get('province')
        address.city = data.get('city')
        address.barangay = data.get('barangay')
        address.postal_code = data.get('postal_code')
        address.latitude = data.get('latitude')
        address.longitude = data.get('longitude')

        db.session.commit()
        return jsonify({'message': 'Address updated successfully!'}), 200
    
    return jsonify({'message': 'Address not found!'}), 404


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True
    ,host="0.0.0.0",
    port=8082,
    ssl_context=(
        "C:\\Users\\XtiaN\\ECommerceCN\\flask-backend\\cert.pem",
        "C:\\Users\\XtiaN\\ECommerceCN\\flask-backend\\key.pem"
    )
)


