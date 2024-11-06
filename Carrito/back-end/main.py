from flask import Flask, render_template
from api.get_all_api import get_all_api
from api.get_last_api import get_last_api
from api.crud_api import crud_api

app = Flask(__name__)

# Registrar los Blueprints
app.register_blueprint(get_all_api)
app.register_blueprint(get_last_api)
app.register_blueprint(crud_api)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
