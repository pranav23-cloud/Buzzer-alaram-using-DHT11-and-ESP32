#include <DHT.h>

#define DHT_PIN 4
#define DHT_TYPE DHT11
#define BUZZER_PIN 25

DHT dht(DHT_PIN, DHT_TYPE);

// Default temperature limit
float temperatureLimit = 29.0;

void setup() {

  Serial.begin(115200);

  dht.begin();

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  delay(1000);

  Serial.println("ESP32 Temperature Alarm Started");
  Serial.println("READY");
}

void loop() {

  float temperature = dht.readTemperature();

  if (isnan(temperature)) {

    Serial.println("ERROR:DHT11");

    digitalWrite(BUZZER_PIN, LOW);

    delay(2000);
    return;
  }

  // Check if browser sent a new temperature limit
  if (Serial.available()) {

    String command = Serial.readStringUntil('\n');

    command.trim();

    if (command.startsWith("LIMIT:")) {

      String value = command.substring(6);

      float newLimit = value.toFloat();

      temperatureLimit = newLimit;

      Serial.print("LIMIT_SET:");
      Serial.println(temperatureLimit);
    }
  }

  // Temperature alarm
  if (temperature > temperatureLimit) {

    digitalWrite(BUZZER_PIN, HIGH);

    Serial.print("TEMP:");
    Serial.print(temperature);
    Serial.print(",LIMIT:");
    Serial.print(temperatureLimit);
    Serial.println(",STATUS:ALARM");

  } else {

    digitalWrite(BUZZER_PIN, LOW);

    Serial.print("TEMP:");
    Serial.print(temperature);
    Serial.print(",LIMIT:");
    Serial.print(temperatureLimit);
    Serial.println(",STATUS:NORMAL");
  }

  delay(2000);
}