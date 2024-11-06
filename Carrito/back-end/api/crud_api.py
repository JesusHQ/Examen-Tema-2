# api/crud_api.py

from flask import Blueprint, request, jsonify
from database import get_connection

crud_api = Blueprint('crud_api', __name__)

@crud_api.route('/api/status/<int:id>', methods=['GET'])
def get_status(id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT id, date, status, ip_cliente, name, id_device, accion FROM IoTCarStatus WHERE id = %s"
            cursor.execute(sql, (id,))
            result = cursor.fetchone()
            return jsonify(result) if result else jsonify({"error": "ID not found"}), 404
    finally:
        connection.close()

@crud_api.route('/api/status', methods=['POST'])
def create_status():
    data = request.json
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO IoTCarStatus (status, ip_cliente, name, id_device, accion)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (data['status'], data['ip_cliente'], data['name'], data['id_device'], data.get('accion')))
            connection.commit()
            return jsonify({"message": "Record created successfully"}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@crud_api.route('/api/status/<int:id>', methods=['PUT'])
def update_status(id):
    data = request.json
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                UPDATE IoTCarStatus
                SET status = %s, ip_cliente = %s, name = %s, id_device = %s, accion = %s
                WHERE id = %s
            """
            cursor.execute(sql, (data['status'], data['ip_cliente'], data['name'], data['id_device'], data.get('accion'), id))
            connection.commit()
            return jsonify({"message": "Record updated successfully"})
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@crud_api.route('/api/status/<int:id>', methods=['DELETE'])
def delete_status(id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM IoTCarStatus WHERE id = %s"
            cursor.execute(sql, (id,))
            connection.commit()
            return jsonify({"message": "Record deleted successfully"})
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

