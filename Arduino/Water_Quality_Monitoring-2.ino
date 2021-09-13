// imports for tds sensor
#include <GravityTDS.h>
#include <EEPROM.h>
// imports for ds18b20
#include <OneWire.h>
#include <DallasTemperature.h>

#define TDS_SENSOR_PIN A0
GravityTDS gravityTds;

#define PH_PIN A1

#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

#include <WiFiEsp.h>
#include "secrets.h"
#include "ThingSpeak.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

WiFiEspClient  client;

// Emulate Serial1 on pins 6/7 if not present
#include "SoftwareSerial.h"
SoftwareSerial Serial1(6, 7); // RX, TX

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;

float tds = 0, eC = 0, pH = 0, tempC = 0, lastTempC = 25.0;

void setup() {
  Serial.begin(115200);

  while (!Serial) {}

  // initialize serial for ESP module
  Serial1.begin(9600);

  while (!Serial) {}

  Serial.println("Searching for ESP8266...");

  // initialize ESP module
  WiFi.init(&Serial1);
  WiFi.config(IPAddress(192, 168, 0, 45));
  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }
  Serial.println("found it!");

  ThingSpeak.begin(client);  // Initialize ThingSpeak

  gravityTds.setPin(TDS_SENSOR_PIN);
  gravityTds.setAref(5.0);  //reference voltage on ADC, default 5.0V on Arduino UNO
  gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
  gravityTds.begin();  //initialization

  sensors.begin();

  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

void loop() {
  // Connect or reconnect to WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network.
      Serial.print("*");
      delay(3000);
    }
    Serial.println("\nConnected.");
  }

  setSensorValues();

  // set the status
  ThingSpeak.setStatus("Success");
  
  ThingSpeak.setField(1, tempC);
  ThingSpeak.setField(2, tds);
  ThingSpeak.setField(3, eC);
  ThingSpeak.setField(4, pH);

  // write to the ThingSpeak channel
  int resCode = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  if (resCode == 200) {
    Serial.println("Channel update successful.");
    Serial.println("temp: "+String(tempC)+", tds: "+String(tds)+", EC: "+String(eC)+", pH: "+String(pH));
  }
  else {
    Serial.println("Problem updating channel. HTTP error code " + String(resCode));
  }
}

void setSensorValues(void) {
  sensors.requestTemperatures();
  tempC = sensors.getTempCByIndex(0);

  if (tempC == -127) {
    tempC = lastTempC;
  }

  gravityTds.setTemperature(tempC);
  gravityTds.update();  //sample and calculate
  tds = gravityTds.getTdsValue();  // then get the value
  eC = tds * 2.0 / 1000.0; // milisiemens per cm
  eC *= 1000; //microsiemens per cm
  pH = getPH();
  lastTempC = tempC;
}

float getPH(void) {
  unsigned long int avgValue;
  float b;
  int buf[10], temp;
  for (int i = 0; i < 10; i++)
  {
    buf[i] = analogRead(PH_PIN);
    delay(10);
  }
  for (int i = 0; i < 9; i++)
  {
    for (int j = i + 1; j < 10; j++)
    {
      if (buf[i] > buf[j])
      {
        temp = buf[i];
        buf[i] = buf[j];
        buf[j] = temp;
      }
    }
  }
  avgValue = 0;
  for (int i = 2; i < 8; i++)
    avgValue += buf[i];
  float pHVol = (float)avgValue * 5.0 / 1024 / 6;
  float v = -5.6933 * pHVol + 23.594;
  return v;
}
