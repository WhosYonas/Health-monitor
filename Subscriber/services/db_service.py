# services/db_service.py

import psycopg2
from models.payload import SensorReading
from utils.logger import get_logger
from config.settings import db  

logger = get_logger(__name__)

def get_connection():
    return psycopg2.connect(db.dsn)

def insert_reading(reading: SensorReading) -> bool:
    #Persist a parsed sensor reading to the database.
    #Returns True on success, False on failure.
    sql = """
        INSERT INTO measurements (heart_rate, spo2, temp, timestamp)
        VALUES (%(heart_rate)s, %(spo2)s, %(temp)s, %(timestamp)s)
    """
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, reading.model_dump())
            conn.commit()
        logger.info(f"Inserted reading at {reading.timestamp}")
        return True
    except psycopg2.Error as e:
        logger.error(f"Failed to insert reading: {e}")
        return False