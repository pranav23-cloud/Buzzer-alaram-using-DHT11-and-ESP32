🌡️ ESP32 Temperature Alarm with DHT11 & USB Web Dashboard

A simple IoT-style temperature monitoring and alarm system using ESP32 + DHT11 + Buzzer.
The temperature limit can be controlled from a web dashboard through USB Serial communication, without using Wi-Fi.

🧠 Easy way to remember

DHT11 → Measures temperature 🌡️
ESP32 → Processes data 🧠
Buzzer → Gives alarm 🔊
USB → Sends data to browser 🔌
Web Dashboard → Displays & sets limit 💻

🚀 Features
🌡️ Real-time temperature monitoring using DHT11
🔊 Buzzer alarm when temperature exceeds the limit
💻 Web dashboard using HTML, CSS and JavaScript
🔌 USB Serial communication
📡 No Wi-Fi required
🎚️ Temperature limit can be changed from the webpage
🟢 Normal / 🔴 Alarm status display
🛠️ Components Required
Component	Quantity
ESP32 Development Board	1
DHT11 Temperature Sensor	1
Buzzer	1
Breadboard	1
Jumper Wires	As required
USB Cable	1
🔌 Circuit Connections
DHT11 → ESP32
DHT11	ESP32
VCC	3.3V
DATA	GPIO 4
GND	GND
Buzzer → ESP32
Buzzer	ESP32
+	GPIO 25
-	GND

For a larger/high-current buzzer, use a transistor driver instead of driving it directly from the GPIO.

📁 Project Structure
temperature-dashboard/
│
├── esp32/
│   └── temperature_alarm.ino
│
└── web/
    ├── index.html
    ├── style.css
    └── script.js
⚙️ How It Works
       🌡️ DHT11
           │
           ▼
       🧠 ESP32
        │     │
        │     └──────► 🔊 Buzzer
        │
        ▼
   🔌 USB Serial
        │
        ▼
   💻 Web Browser
        │
        ▼
 Temperature Dashboard
DHT11 measures the temperature.
ESP32 receives the temperature.
ESP32 compares it with the selected limit.
If temperature exceeds the limit → buzzer ON.
ESP32 sends temperature/status through USB Serial.
Browser displays the live temperature.
User can set a new temperature limit from the webpage.
💻 Web Dashboard

The dashboard displays:

Current temperature
Temperature limit
Connection status
Normal/Alarm status
Buzzer status

Example:

🌡️ ESP32 Temperature Monitor

🟢 ESP32 Connected

Current Temperature
30.0 °C

Temperature Limit
29.0 °C

🔴 TEMPERATURE ALERT!
Temperature exceeded the limit!

Buzzer: ON
Communication: USB Serial
🔧 Arduino Libraries

Install the following library in Arduino IDE:

DHT sensor library

Also install its dependency if Arduino IDE asks for it:

Adafruit Unified Sensor
🌐 Browser Requirement

The web dashboard uses the Web Serial API.

Use a browser such as:

Google Chrome
Microsoft Edge

Connect the ESP32 using USB and select the ESP32 serial port from the webpage.

Important: Close Arduino IDE Serial Monitor before connecting from the browser.

📊 Serial Communication Format

ESP32 sends data like:

TEMP:28.0,LIMIT:29.0,STATUS:NORMAL

When temperature is high:

TEMP:30.0,LIMIT:29.0,STATUS:ALARM

The webpage reads this data and updates the dashboard.

🎯 Example

If the webpage limit is:

29°C

and DHT11 measures:

28°C

➡️ Buzzer OFF
➡️ Status NORMAL

If DHT11 measures:

30°C

➡️ Buzzer ON
➡️ Status ALARM

📌 Future Improvements
📈 
Add temperature graphs
💾 
Store temperature history
⏰ 
Add alarm duration/timer
📊 
Add CSV data logging
🌐 
Add Wi-Fi version
📱 
Make the dashboard mobile-friendly
👨‍💻 Author

Pranav Patil

Built using:

ESP32 + DHT11 + Buzzer + HTML + CSS + JavaScript

No Wi-Fi — USB Serial communication only.