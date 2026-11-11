let mSound;
let meter;

// Use async setup for p5.js v2 asset loading
async function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  
  // 1. Await audio loading
  mSound = await loadSound('assets/PER_FINAL.mp3');
  
  // 2. Initialize analyzer and connect audio
  meter = new p5.Amplitude();
  mSound.connect(meter);
}

function draw() {
  background(220, 20, 15);
  
  // 3. Get current volume level (0.0 to 1.0)
  let level = meter.getLevel();
  
  // 4. Map volume level to circle size and color hue
  let circleSize = map(level, 0, 0.5, 60, 400, true);
  let hueVal = map(level, 0, 0.5, 180, 360, true);
  
  // 5. Draw dynamic audio-reactive geometry
  translate(width / 2, height / 2);
  
  // Inner pulsing core
  fill(hueVal, 80, 100);
  noStroke();
  circle(0, 0, circleSize);
  
  // Outer reactive ring
  noFill();
  stroke(hueVal, 50, 100);
  strokeWeight(level * 30);
  circle(0, 0, circleSize * 1.4);
}

function mousePressed() {
  if (mSound.isPlaying()) {
    mSound.stop();
  } else {
    mSound.play();
  }
}