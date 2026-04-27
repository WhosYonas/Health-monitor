from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

#class MQTTSettings(BaseSettings):
    #Define all the config needed to know the broker
    #broker_host: str = Field(..., alias="MQTT_BROKER_HOST")
    #broker_port: int = Field(8883, alias="MQTT_BROKER_PORT")
   # client_id: str = Field(..., alias="MQTT_CLIENT_ID")
  #  topic: str = Field(..., alias="MQTT_TOPIC")
 #   keepalive: int = Field(..., alias="KEEP_ALIVE")
#
  #  ca_cert: Path = Field(BASE_DIR / "certs/ca.crt", alias="MQTT_CA_CERT")
 #   client_cert: Path = Field(BASE_DIR / "certs/client.crt", alias="MQTT_CLIENT_CERT")
#    client_key: Path = Field(BASE_DIR / "certs/client.key", alias="MQTT_CLIENT_KEY")
#
#    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

class DatabaseSettings(BaseSettings):
    db_host: str = Field(..., alias="DATABASE_HOST")
    db_port: int = Field(..., alias="DATABASE_PORT")
    db_name: str = Field(..., alias="DATABASE_NAME")
    db_user: str = Field(..., alias="DATABASE_USER")
    db_password: str = Field(..., alias="DATABASE_PASSWORD")

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

    @property
    def dsn(self) -> str:
        return (
            f"postgresql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )
    
class LogSettings(BaseSettings):
    log_level: str = Field("INFO", alias="LOG_LEVEL")
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

log = LogSettings()
#mqtt = MQTTSettings()
db = DatabaseSettings()