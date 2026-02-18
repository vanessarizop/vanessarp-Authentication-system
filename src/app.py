
import os
from flask_cors import CORS 
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity ,JWTManager
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, send_from_directory, Blueprint
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)

app.url_map.strict_slashes = False
# CORS
CORS(app)

#configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
jwt=JWTManager(app)
api = Blueprint('api', __name__)
bcrypt = Bcrypt(app)


pw_hash = bcrypt.generate_password_hash('hunter2').decode('utf-8')
bcrypt.check_password_hash(pw_hash, 'hunter2') # returns True

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
#app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


#@app.errorhandler(APIException)
#def handle_invalid_usage(error):
 #   return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route('/signup', methods=['POST'])
def signup_user():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "Cuerpo de la solicitud vacío"}), 400

    name = body.get("name")
    email = body.get("email")
    password = body.get("password")

    if not name or not email or not password:
        return jsonify({"msg": "Es necesario completar todos los campos"}), 400

    user = User.query.filter_by(email=email).first()
    if user is not None:
        return jsonify({"msg": "El usuario ya existe"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=pw_hash, is_active=True)
    
    db.session.add(new_user)
    db.session.commit()
 
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"msg": "Usuario creado exitosamente","token": access_token, "email": new_user.email}), 201
    

@app.route('/login', methods=['POST'])
def login_user():
    body=request.get_json(silent=True)
    
    if body is None:
        return {"msg":"Es necesario completar todos los campos"},400
    email=body.get("email")
    password=body.get("password")
    
    user=User.query.filter_by(email=email).first() 
    if user is None:
        return {"msg":"Credenciales invalidas"}, 401 
    
    is_password_correct=bcrypt.check_password_hash(user.password,password)
    if not is_password_correct:
        return {"msg":"contraseña invalidas"}, 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({ "token": access_token, "email":  user.email }), 200
    #return jsonify(access_token=access_token), 200
 

@app.route('/private', methods=['GET'])
@jwt_required()
def private():
   try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))  # ✅ int() para la query
        
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify({"email": user.email, "name": user.name}), 200
   except Exception as e:
        print(f"Error en servidor: {str(e)}")
        return jsonify({"msg": "Error interno del servidor"}), 500


app.register_blueprint(api, url_prefix='/api')
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
