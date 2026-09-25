#include <DHT.h>

#define DHT_PIN 4
#define DHT_TYPE DHT11

#define TRIG_PIN 5
#define ECHO_PIN 18

DHT dht(DHT_PIN, DHT_TYPE);

float readDistance() {

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration == 0) {
    return -1;
  }

  float distance = duration * 0.0343 / 2.0;

  return distance;
}

void setup() {

  Serial.begin(115200);

  dht.begin();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  digitalWrite(TRIG_PIN, LOW);

  delay(1000);

  Serial.println("{\"status\":\"ESP32_READY\"}");
}

void loop() {

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float distance = readDistance();

  Serial.print("{\"temperature\":");

  if (isnan(temperature)) {
    Serial.print("null");
  } else {
    Serial.print(temperature, 1);
  }

  Serial.print(",\"humidity\":");

  if (isnan(humidity)) {
    Serial.print("null");
  } else {
    Serial.print(humidity, 1);
  }

  Serial.print(",\"distance\":");

  if (distance < 0) {
    Serial.print("null");
  } else {
    Serial.print(distance, 1);
  }

  Serial.println("}");

  delay(2000);
}