void setup() {
  Serial.begin(57600)
  Serial.println("ParticleExample started.")
  
  Particle.function("myFunction",myFunction);
}

void loop() {
  // put your main code here, to run repeatedly:

}

int myFunction(String command) {
    Serial.println("myFunction called.");
    // We don't need to return anything.
    // Just return an easy to recognize number for testing
    return 123;   
}

