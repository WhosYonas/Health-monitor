import paho.mqtt.client as paho_client
from config.settings import mqtt as mqtt_settings
from utils.parser import parse_payload
from services.db_service import insert_reading
from utils.logger import get_logger
import ssl


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
    # Use CallbackAPIVersion if you are on paho-mqtt 2.0+
    # client = paho_client.Client(paho_client.CallbackAPIVersion.VERSION1)
    client = paho_client.Client()
    
    # 1. Configure TLS
    # We change cert_reqs to ssl.CERT_NONE to bypass the strict chain check
    client.tls_set(
        ca_certs=str(mqtt_settings.ca_cert),
        certfile=str(mqtt_settings.client_cert),
        keyfile=str(mqtt_settings.client_key),
        cert_reqs=ssl.CERT_NONE, 
        tls_version=ssl.PROTOCOL_TLSv1_2
    )
    
    # 2. Disable hostname verification (crucial for Docker internal networking)
    client.tls_insecure_set(True)
    
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    # 3. Connection attempt
    try:
        logger.info(f"Connecting to {mqtt_settings.broker_host}:{mqtt_settings.broker_port}...")
        client.connect(mqtt_settings.broker_host, mqtt_settings.broker_port)
    except Exception as e:
        logger.error(f"Connection failed: {e}")
        # In a real app, you might want to retry here instead of raising
        raise 
        
    return client