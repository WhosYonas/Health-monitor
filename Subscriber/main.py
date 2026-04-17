from services.mqtt_client import create_client

client = create_client()
client.loop_forever()