import paho.mqtt.client as mqtt
from config.settings import settings
from models.payload import parse_payload
from utils.logger import get_logger

logger = get_logger(__name__)


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("Connected to MQTT broker")
        client.subscribe(settings.MQTT_TOPIC)
        logger.info(f"Subscribed to topic: {settings.MQTT_TOPIC}")
    else:
        logger.error(f"Failed to connect, return code: {rc}")


def on_message(client, userdata, msg):
    logger.debug(f"Raw message received on {msg.topic}")
    reading = parse_payload(msg.payload)
    if reading is None:
        logger.warning("Skipping invalid reading")
        return
    logger.info(f"Valid reading: {reading}")


def on_disconnect(client, userdata, rc):
    if rc != 0:
        logger.warning(f"Unexpected disconnect (rc={rc}), will auto-reconnect")


def create_client() -> mqtt.Client:
    client = mqtt.Client()

    # mTLS
    client.tls_set(
        ca_certs=settings.CA_CERT,
        certfile=settings.CLIENT_CERT,
        keyfile=settings.CLIENT_KEY,
    )

    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
    return client