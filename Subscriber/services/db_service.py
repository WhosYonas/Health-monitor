# services/db_service.py

import psycopg2
from models.payload import SensorReading
from utils.logger import get_logger
from config.settings import db  

logger = get_logger(__name__)

def get_connection():
    return psycopg2.connect(db.dsn)

def insert_reading(reading: SensorReading) -> bool:
    sql_lookup = "SELECT device_id FROM device WHERE device_uid = %s"
    sql_insert = """
        INSERT INTO measurement (device_id, blood_oxygen, heart_rate, temperature)
        VALUES (%s, %s, %s, %s)
    """
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql_lookup, (reading.device_id,))
                row = cur.fetchone()
                if row is None:
                    logger.error(f"No device found for uid: {reading.device_id}")
                    return False
                device_pk = row[0]
                cur.execute(sql_insert, (device_pk, reading.spo2, reading.heart_rate, reading.temperature))
            conn.commit()
        logger.info(f"Inserted reading for device {reading.device_id}")
        return True
    except psycopg2.Error as e:
        logger.error(f"Failed to insert reading: {e}")
        return False