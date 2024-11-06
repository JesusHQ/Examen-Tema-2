#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

// Configuración Wi-Fi
const char* ssid = "MARCOS-LP";
const char* password = "12345678";

// URL del endpoint
const char* serverUrl = "http://3.89.58.80:5000/api/status/last";

// Pines del sensor ultrasónico
const int EchoPin = 33;
const int TriggerPin = 25;

// Pines de los motores
const int motorDelanteroAtras = 14;
const int motorDelanteroAdelante = 12;
const int motorTraseroAtras = 26;
const int motorTraseroAdelante = 27;

// Pines y configuración del servo
#define PINSERVO 32
Servo servoMotor;
int paso = 50;

// Pines de LEDs
const int ledRojoDerecho = 16;
const int ledRojoIzquierdo = 17;
const int ledNaranjaDerecho = 18;
const int ledNaranjaIzquierdo = 19;

// Variable para almacenar el último status
int status = 0;
bool enMovimientoAdelante = false; // Variable para controlar el movimiento hacia adelante

void setup() {
  Serial.begin(115200);

  // Configurar Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado al WiFi");

  // Configurar pines de motores y LEDs como salidas
  pinMode(motorDelanteroAdelante, OUTPUT);
  pinMode(motorDelanteroAtras, OUTPUT);
  pinMode(motorTraseroAdelante, OUTPUT);
  pinMode(motorTraseroAtras, OUTPUT);
  pinMode(TriggerPin, OUTPUT);
  pinMode(EchoPin, INPUT);
  pinMode(ledRojoDerecho, OUTPUT);
  pinMode(ledRojoIzquierdo, OUTPUT);
  pinMode(ledNaranjaDerecho, OUTPUT);
  pinMode(ledNaranjaIzquierdo, OUTPUT);

  // Iniciar el servo
  servoMotor.attach(PINSERVO);
}

void loop() {
  // Actualizar el estado desde la API
  obtenerStatus();

  // Ejecutar la acción en función del status
  ejecutarAccion(status);
  
  delay(2000); // Esperar 2 segundos antes de la siguiente actualización
}

// Función para hacer una solicitud GET y obtener el status
void obtenerStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);

    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      String payload = http.getString();
      Serial.println("Respuesta de la API: " + payload);

      // Parsear el JSON para obtener el campo "status"
      int statusIndex = payload.indexOf("\"status\":") + 9;
      status = payload.substring(statusIndex, payload.indexOf(",", statusIndex)).toInt();

      Serial.print("Status recibido: ");
      Serial.println(status);
    } else {
      Serial.print("Error en la solicitud: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Error: No conectado a WiFi");
  }
}

// Función para ejecutar la acción basada en el valor de status
void ejecutarAccion(int status) {
  apagarLuces(); // Apagar las luces antes de ejecutar una nueva acción

  switch (status) {
    case 1: // Adelante
      if (!enMovimientoAdelante) { // Solo activar avanzar si no está en movimiento hacia adelante
        moverAdelante();
        enMovimientoAdelante = true;
      }
      break;
    case 2: // Atrás
      retroceder(1000);
      enMovimientoAdelante = false;
      break;
    case 3: // Izquierda
      girarIzquierdaContinuo();
      enMovimientoAdelante = false;
      break;
    case 4: // Derecha
      girarDerechaContinuo();
      enMovimientoAdelante = false;
      break;
    case 5: // Detener
      detenerMotores();
      enMovimientoAdelante = false;
      break;
    case 6: // Giro derecha continuo
      girarDerechaContinuo();
      enMovimientoAdelante = false;
      break;
    case 7: // Giro izquierda continuo
      girarIzquierdaContinuo();
      enMovimientoAdelante = false;
      break;
    case 8: // Luces delantera
      digitalWrite(ledNaranjaDerecho, HIGH);
      digitalWrite(ledNaranjaIzquierdo, HIGH);
      break;
    case 9: // Luces trasera
      digitalWrite(ledRojoDerecho, HIGH);
      digitalWrite(ledRojoIzquierdo, HIGH);
      break;
    default:
      detenerMotores();
      enMovimientoAdelante = false;
      break;
  }
}

// Función para avanzar y esquivar obstáculos
void moverAdelante() {
  // Activa los motores hacia adelante sin detenerlos
  digitalWrite(motorDelanteroAtras, HIGH);
  digitalWrite(motorTraseroAtras, HIGH);
}

// Función para medir la distancia con el sensor ultrasónico
float ping(int TriggerPin, int EchoPin) {
  digitalWrite(TriggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(TriggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(TriggerPin, LOW);

  return pulseIn(EchoPin, HIGH) / 58.2;
}

// Función para explorar y buscar una nueva salida
void explorarYBuscarSalida() {
  servoMotor.write(45);
  delay(500);
  float distanciaIzquierda = ping(TriggerPin, EchoPin);

  servoMotor.write(135);
  delay(500);
  float distanciaDerecha = ping(TriggerPin, EchoPin);

  servoMotor.write(90);
  delay(500);

  if (distanciaIzquierda > 20.0) {
    girarIzquierda(500);
  } else if (distanciaDerecha > 20.0) {
    girarDerecha(500);
  } else {
    retroceder(1000);
    girar180();
  }
}

// Funciones auxiliares
void girar180() {
  digitalWrite(motorDelanteroAdelante, HIGH);
  digitalWrite(motorTraseroAtras, HIGH);
  delay(660);
  detenerMotores();
}

void retroceder(int tiempo) {
  digitalWrite(motorDelanteroAdelante, HIGH);
  digitalWrite(motorTraseroAdelante, HIGH);
  delay(tiempo);
  detenerMotores();
}

// Giros continuos
void girarIzquierdaContinuo() {
  digitalWrite(motorDelanteroAdelante, HIGH);
  digitalWrite(motorTraseroAtras, HIGH);
}

void girarDerechaContinuo() {
  digitalWrite(motorDelanteroAtras, HIGH);
  digitalWrite(motorTraseroAdelante, HIGH);
}

// Función para detener los motores
void detenerMotores() {
  digitalWrite(motorDelanteroAdelante, LOW);
  digitalWrite(motorDelanteroAtras, LOW);
  digitalWrite(motorTraseroAdelante, LOW);
  digitalWrite(motorTraseroAtras, LOW);
  enMovimientoAdelante = false; // Resetear el estado de movimiento hacia adelante
}

void apagarLuces() {
  digitalWrite(ledRojoDerecho, LOW);
  digitalWrite(ledRojoIzquierdo, LOW);
  digitalWrite(ledNaranjaDerecho, LOW);
  digitalWrite(ledNaranjaIzquierdo, LOW);
}
