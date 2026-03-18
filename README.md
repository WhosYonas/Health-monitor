# IoT Health Monitor

A real-time health monitoring system built with an ESP32 sensor node and a Raspberry Pi 5 backend server. The device continuously measures heart rate, blood oxygen (SpO2), and body temperature, transmitting readings securely to a central server over MQTT with mutual TLS authentication.

## Overview

The ESP32 collects sensor data and publishes it to a Mosquitto MQTT broker running on the Raspberry Pi. A Python subscriber receives the data and stores it in a PostgreSQL database. A REST API exposes the data to a React frontend dashboard for real-time visualization.

## Hardware

| Component | Purpose |
|---|---|
| ESP32 | Main microcontroller + WiFi |
| MAX30102 | Heart rate + blood oxygen (SpO2) |
| DS18B20 | Body temperature |
| SSD1306 | Small OLED display |
| LEDs | Status indicators |
| Li-Po battery + TP4056 | Portable power + charging |
| Raspberry Pi 5 | Backend server, database, API |

## Tech Stack

| Layer | Technology |
|---|---|
| Firmware | C++ (Arduino framework) |
| Communication | MQTT over TLS (Mosquitto) |
| Backend | Python (paho-mqtt, Flask) |
| Database | PostgreSQL |
| Frontend | Nextjs + TypeScript + Tailwind CSS |
| Remote access | DuckDNS + port forwarding |

## Architecture
```
ESP32 (sensor node)
  └── publishes over MQTT/TLS (port 8883)
        └── Mosquitto broker (Raspberry Pi)
              └── Python subscriber
                    └── PostgreSQL
                          └── Flask REST API
                                └── React frontend
```

## Security

All communication between the ESP32 and the broker is encrypted and authenticated using mutual TLS (mTLS). Both the broker and the ESP32 present X.509 certificates signed by a shared Certificate Authority. Connections without a valid certificate are rejected at the TLS handshake level.
