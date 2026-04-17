import json
from pydantic import ValidationError
from utils.logger import get_logger
from models.payload import SensorReading

logger = get_logger(__name__)

def parse_payload(raw: bytes) -> SensorReading | None:
    try:
        #Decodes raw bytes into python dict
        data = json.loads(raw)
        return SensorReading(**data)
    except (ValidationError, json.JSONDecodeError) as e:
        logger.error(f"Invalid payload: {e}")
        return None