#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* firebaseHost ="give your project link of firebase"
// Seat Pins
#define A1 13
#define A2 12
#define A3 14
#define A4 27

WiFiClientSecure client;

void connectWiFi() {
  WiFi.begin(ssid, password, 6);

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

void sendToFirebase(String path, String json) {

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  client.setInsecure();

  HTTPClient http;

  String url = String(firebaseHost) + path + ".json";

  http.begin(client, url);

  http.addHeader("Content-Type", "application/json");

  http.PUT(json);

  http.end();
}

void setup() {

  pinMode(A1, INPUT_PULLUP);
  pinMode(A2, INPUT_PULLUP);
  pinMode(A3, INPUT_PULLUP);
  pinMode(A4, INPUT_PULLUP);

  connectWiFi();
}

void loop() {

  // ---------- Read Seats ----------
  String seat1 = digitalRead(A1) == HIGH ? "occupied" : "available";
  String seat2 = digitalRead(A2) == HIGH ? "occupied" : "available";
  String seat3 = digitalRead(A3) == HIGH ? "occupied" : "available";
  String seat4 = digitalRead(A4) == HIGH ? "occupied" : "available";

  // ---------- Count ----------
  int occupied = 0;

  if (seat1 == "occupied") occupied++;
  if (seat2 == "occupied") occupied++;
  if (seat3 == "occupied") occupied++;
  if (seat4 == "occupied") occupied++;

  int total = 4;
  int available = total - occupied;

  // ---------- Seat JSON ----------
  String seatJson = "{";
  seatJson += "\"A1\":\"" + seat1 + "\",";
  seatJson += "\"A2\":\"" + seat2 + "\",";
  seatJson += "\"A3\":\"" + seat3 + "\",";
  seatJson += "\"A4\":\"" + seat4 + "\"";
  seatJson += "}";

  // ---------- Summary JSON ----------
  String summaryJson = "{";
  summaryJson += "\"totalSeats\":" + String(total) + ",";
  summaryJson += "\"availableSeats\":" + String(available) + ",";
  summaryJson += "\"occupiedSeats\":" + String(occupied);
  summaryJson += "}";

  // ---------- Upload ----------
  sendToFirebase("/librarySeats", seatJson);

  sendToFirebase("/summary", summaryJson);

  delay(500);
}