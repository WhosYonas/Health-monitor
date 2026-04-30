#include <Wire.h> // Aktiverar I²C-kommunikation.
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// MAX30102 raw data reader
#include "MAX30105.h"

// Maxim original HR + Sp02 algoritm
#include "spo2_algorithm.h"

// OLED
#include <U8g2lib.h>

// DS18B20 temperature sensor
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- WiFi + Backend ----------
const char* WIFI_SSID = "Raffael the Angel";
const char* WIFI_PASSWORD = "Gabriel400";

// Byt denna till backend-teamets endpoint
const char* SERVER_URL = "http://192.168.1.50:5000/api/sensor-data";

const char* DEVICE_ID = "esp32_001";
const int PATIENT_ID = 1;

unsigned long lastBackendSend = 0;
const unsigned long backendSendInterval = 5000; // skicka var 5:e sekund

//-----------OLED-------------------------

U8G2_SSD1306_128X64_NONAME_F_HW_I2C oled(
  U8G2_R0,
  U8X8_PIN_NONE
);

//----------------DS18B20--------------------------------
#define ONE_WIRE_BUS 4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

//--------- HJÄRTA FÖR OLED ---------

void drawHeartSmall(int x, int y) {
  oled.drawDisc(x + 2, y + 2, 2);
  oled.drawDisc(x + 6, y + 2, 2);
  oled.drawTriangle(x, y + 3, x + 8, y + 3, x + 4, y + 9);
}

void drawHeartBig(int x, int y) {
  oled.drawDisc(x + 4, y + 4, 4);
  oled.drawDisc(x + 12, y + 4, 4);
  oled.drawTriangle(x, y + 6, x + 16, y + 6, x + 8, y + 20);
}

//---------MAX30102-----------
MAX30105 particleSensor;

const int32_t bufferLength = 20;

uint32_t irBuffer[bufferLength];   // ir för puls
uint32_t redBuffer[bufferLength];  // red för syre

int32_t spo2 = -777;
int8_t spo2Valid = 0;

int32_t heartRate = -777;
int8_t heartRateValid = 0;

//------- status -------------

bool oledOK = false;
bool max301020K = false;
bool tempOK = false;

float temperatureC = 0.0;

unsigned long lastTemperatureRead = 0;

//---------OLED function ---------------

void drawOLED(String statusText) {
  if (!oledOK) {
    return;
  }

  oled.clearBuffer();

  oled.setFont(u8g2_font_6x10_tf);

  oled.drawStr(0, 10, "Health Monitor");

  char line[32];

  if (max301020K && heartRateValid == 1) {
    sprintf(line, "Pulse: %ld BPM", heartRate);
  } else {
    sprintf(line, "Pulse: -- BPM");
  }

  oled.drawStr(0, 25, line);

  // Heart animation beside pulse
  if (max301020K && heartRateValid == 1 && heartRate > 0) {
    int beatInterval = 60000 / heartRate;   // ms per beat
    bool beat = (millis() % beatInterval) < 150;

    if (beat) {
      drawHeartBig(104, 6);
    } else {
      drawHeartSmall(108, 15);
    }
  } else {
    drawHeartSmall(108, 15);
  }

  if (max301020K && spo2Valid == 1) {
    sprintf(line, "SpO2 : %ld %%", spo2);
  } else {
    sprintf(line, "SpO2 : -- %%");
  }

  oled.drawStr(0, 38, line);

  if (tempOK) {
    sprintf(line, "Temp : %.1f C", temperatureC);
  } else {
    sprintf(line, "Temp : -- C");
  }

  oled.drawStr(0, 51, line);

  oled.drawStr(0, 63, statusText.c_str());

  oled.sendBuffer();
}

// ------------ Temperature -------------
void readTemperature() {
  tempSensor.requestTemperatures();
  float temp = tempSensor.getTempCByIndex(0);

  if (temp == DEVICE_DISCONNECTED_C) {
    Serial.println("DS18B20 disconnected or read failed");
    tempOK = false;
    return;
  }

  if (temp == 85.0) {
    Serial.println("DS18B20 returned 85.0 C, ignoring.");
    return;
  }

  tempOK = true;
  temperatureC = temp;

  Serial.print("DS18B20 temperature: ");
  Serial.println(temperatureC);
}

///------------JSON-----------------------
String createSensorJson() {
  StaticJsonDocument<256> doc;

  doc["device_id"] = DEVICE_ID;
  doc["patient_id"] = PATIENT_ID;
  doc["heart_rate"] = heartRateValid ? heartRate : -1;
  doc["spo2"] = spo2Valid ? spo2 : -1;
  doc["temperature"] = tempOK ? temperatureC : -1;

  String jsonData;
  serializeJson(doc, jsonData);
  return jsonData;
}

void sendToBackend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String json = createSensorJson();
  int responseCode = http.POST(json);

  if (responseCode > 0) {
    Serial.print("Backend response: ");
    Serial.println(responseCode);
  } else {
    Serial.print("HTTP failed: ");
    Serial.println(http.errorToString(responseCode));
  }

  http.end();
}


//---------------------------------------


// ---------- MAX30102 samples ----------
void readMax30102Samples() {
  for (int i = 0; i < bufferLength; i++) {
    while (!particleSensor.available()) {
      particleSensor.check();
    }

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();

    particleSensor.nextSample();
  }
}

// ---------- Setup ----------
void setup() {

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
}

Serial.println("\nWiFi connected");
Serial.println(WiFi.localIP());

  Serial.begin(115200);
  delay(1000);
  Serial.println("Starting Health Monitor...");

  Wire.begin();

  // Start OLED
  Wire.begin(A4, A5);
  Wire.setClock(400000);

  // Start OLED with U8g2
  oled.begin();
  oled.setContrast(255);

  oledOK = true;
  Serial.println("OLED started with U8g2.");

  drawOLED("Starting...");

  // Start DS18B20
  pinMode(ONE_WIRE_BUS, INPUT_PULLUP);

tempSensor.begin();
tempSensor.setResolution(12);

int deviceCount = tempSensor.getDeviceCount();

Serial.print("DS18B20 device count: ");
Serial.println(deviceCount);

if (deviceCount > 0) {
  tempOK = true;
  Serial.println("DS18B20 found.");
} else {
  tempOK = false;
  Serial.println("DS18B20 not found. Check wiring, GPIO pin, and 4.7k pull-up resistor.");
}

  // Start MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    max301020K = false;
    Serial.println("MAX30102 not found.");
    drawOLED("MAX30102 error");
  } else {
    max301020K = true;
    Serial.println("MAX30102 found.");

    byte ledBrightness = 60;
    byte sampleAverage = 1;
    byte ledMode = 2;        // 2 = Red + IR
    byte sampleRate = 25;    // Same as Maxim algorithm expectation
    int pulseWidth = 411;
    int adcRange = 4096;

    particleSensor.setup(
      ledBrightness,
      sampleAverage,
      ledMode,
      sampleRate,
      pulseWidth,
      adcRange
    );

    particleSensor.setPulseAmplitudeRed(0x3F);
    particleSensor.setPulseAmplitudeIR(0x3F);
    particleSensor.setPulseAmplitudeGreen(0);
  }

  readTemperature();

  drawOLED("Place finger...");
  delay(1500);
}

void loop() {

  String statusText = "";

  // Read temperature once per second
  if (millis() - lastTemperatureRead >= 1000) {
    lastTemperatureRead = millis();
    readTemperature();
  }

  if (!max301020K) {
    heartRate = -777;
    spo2 = -777;
    heartRateValid = 0;
    spo2Valid = 0;

    drawOLED("Pulse sensor ERR");
    Serial.println("MAX30102 not ready.");
    delay(1000);
    return;
  }

  drawOLED("Reading pulse...");
  Serial.println("Reading 100 MAX30102 samples...");

  readMax30102Samples();

  // Check if finger is on sensor
  uint32_t irAverage = 0;

  for (int i = 0; i < bufferLength; i++) {
    irAverage += irBuffer[i];
  }

  irAverage = irAverage / bufferLength;

  if (irAverage < 50000) {
    heartRate = -777;
    spo2 = -777;
    heartRateValid = 0;
    spo2Valid = 0;

    statusText = "No finger";
  } else {
    maxim_heart_rate_and_oxygen_saturation(
      irBuffer,
      bufferLength,
      redBuffer,
      &spo2,
      &spo2Valid,
      &heartRate,
      &heartRateValid
    );

    if (heartRateValid == 1 && spo2Valid == 1) {
      statusText = "Measuring OK";
    } else {
      statusText = "Hold finger still";
    }
  }




//------------Jsondata------------------
  String json = createSensorJson();
  Serial.println(json);


if (millis() - lastBackendSend >= backendSendInterval) {
  lastBackendSend = millis();
  sendToBackend();
}

//-----------------------------------------------

  Serial.print("HR=");
  Serial.print(heartRate);
  Serial.print(" HRvalid=");
  Serial.print(heartRateValid);

  Serial.print(" | SpO2=");
  Serial.print(spo2);
  Serial.print(" SpO2valid=");
  Serial.print(spo2Valid);

  Serial.print(" | Temp=");
  Serial.print(temperatureC);
  Serial.print(" C");

  Serial.print(" | IRavg=");
  Serial.println(irAverage);

  drawOLED(statusText);

  //client.begin(SERVER_URL);
  //client.addHeader("Content-Type", "application/json");
  

  delay(200);
}