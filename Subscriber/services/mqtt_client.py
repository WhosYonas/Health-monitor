import paho.mqtt.client as paho_client
from config.settings import mqtt as mqtt_settings
from utils.parser import parse_payload
from services.db_service import insert_reading
from utils.logger import get_logger

logger = get_logger(__name__)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("Connected to MQTT broker")
        client.subscribe(mqtt_settings.topic)
        logger.info(f"Subscribed to topic: {mqtt_settings.topic}")
    else:
        logger.error(f"Failed to connect, return code: {rc}")

def on_message(client, userdata, msg):
    logger.debug(f"Raw message received on {msg.topic}")
    reading = parse_payload(msg.payload)
    if reading is None:
        logger.warning("Skipping invalid reading")
        return
    logger.info(f"Valid reading: {reading}")
    insert_reading(reading)

def on_disconnect(client, userdata, rc):
    if rc != 0:
        logger.warning(f"Unexpected disconnect (rc={rc}), will auto-reconnect")

def create_client() -> paho_client.Client:
    client = paho_client.Client()
    
    # Configure TLS
    client.tls_set(
        ca_certs=str(mqtt_settings.ca_cert),   # Points to /app/certs/ca.crt
        certfile=str(mqtt_settings.client_cert), # Points to /app/certs/client.crt
        keyfile=str(mqtt_settings.client_key),  # Points to /app/certs/client.key
    )
    
    client.tls_insecure_set(True)
    
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    logger.info(f"Connecting to {mqtt_settings.broker_host}...")
    client.connect(mqtt_settings.broker_host, mqtt_settings.broker_port)
    return client