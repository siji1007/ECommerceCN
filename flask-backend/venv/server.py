from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all origins to access this server

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/tourism_ecommerce'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class TestingTable(db.Model):
    __tablename__ = 'testing_table'
    id = db.Column(db.Integer, primary_key=True)
    Fname = db.Column(db.String(50), nullable=False)
    Lname = db.Column(db.String(50), nullable=False)

@app.route('/api/users', methods=['GET'])
def get_users():
    users = TestingTable.query.all()
    results = [{"id": user.id, "Fname": user.Fname, "Lname": user.Lname} for user in users]
    return jsonify(results)

if __name__ == '__main__':
    app.run(port=5000)
