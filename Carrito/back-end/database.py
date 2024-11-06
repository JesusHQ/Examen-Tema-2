# database.py

import pymysql

def get_connection():
    return pymysql.connect(
        host='instancia-db-iot.cr20oy4i65gw.us-east-1.rds.amazonaws.com',
        user='admin',  # Reemplaza con tu usuario de la base de datos
        password='Admin12345#!',  # Reemplaza con tu contraseña
        db='db_iot',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
