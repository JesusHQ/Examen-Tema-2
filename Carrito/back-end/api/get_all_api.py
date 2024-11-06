# api/get_all_api.py

from flask import Blueprint, jsonify
from database import get_connection

get_all_api = Blueprint('get_all_api', __name__)

@get_all_api.route('/api/status', methods=['GET'])
def get_all_status():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Selecciona los campos específicos, incluyendo el nuevo campo 'accion'
            sql = "SELECT id, date, status, ip_cliente, name, id_device, accion FROM IoTCarStatus"
            cursor.execute(sql)
            results = cursor.fetchall()
            
            # Estructura cada registro en un diccionario con nombres de campo
            response = [
                {
                    "id": row["id"],
                    "date": row["date"],
                    "status": row["status"],
                    "ip_cliente": row["ip_cliente"],
                    "name": row["name"],
                    "id_device": row["id_device"],
                    "accion": row["accion"]
                }
                for row in results
            ]
            
            return jsonify(response)
    finally:
        connection.close()
