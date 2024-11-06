# api/get_last_api.py

from flask import Blueprint, jsonify
from database import get_connection

get_last_api = Blueprint('get_last_api', __name__)

@get_last_api.route('/api/status/last', methods=['GET'])
def get_last_status():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Selecciona los campos específicos, incluyendo el nuevo campo 'accion'
            sql = "SELECT id, date, status, ip_cliente, name, id_device, accion FROM IoTCarStatus ORDER BY date DESC LIMIT 1"
            cursor.execute(sql)
            result = cursor.fetchone()
            
            # Estructura el resultado en un diccionario para asegurar que todos los campos se devuelvan con sus nombres
            if result:
                response = {
                    "id": result["id"],
                    "date": result["date"],
                    "status": result["status"],
                    "ip_cliente": result["ip_cliente"],
                    "name": result["name"],
                    "id_device": result["id_device"],
                    "accion": result["accion"]
                }
                return jsonify(response)
            else:
                return jsonify({"error": "No records found"}), 404
    finally:
        connection.close()
