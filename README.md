# ESP32 USB Sensor Dashboard

A simple IoT sensor dashboard using an ESP32, DHT11, HC-SR04, USB Serial, HTML, CSS, and JavaScript.

## 📌 Project Overview

This project uses an ESP32 to collect sensor data and display it on a web dashboard.

The project measures:

- 🌡️ Temperature using DHT11
- 💧 Humidity using DHT11
- 📏 Distance using HC-SR04

The ESP32 sends sensor readings to the computer through **USB Serial**.

The webpage uses JavaScript and the **Web Serial API** to receive the data and display it in real time.

### Data Flow

```text
DHT11 + HC-SR04
       ↓
     ESP32
       ↓
   USB Serial
       ↓
    Browser
       ↓
  JavaScript
       ↓
 HTML + CSS
       ↓
  Dashboard