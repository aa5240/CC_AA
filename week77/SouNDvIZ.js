let mSound;
let fft;
let numShapes = 7;
let orbitRadius = 300;

async function setup() {
  // 1. Initialize 3D canvas in WEBGL mode
  createCanvas(windowWidth, windowHeight, WEBGL);

  // 2. Initialize FFT frequency analyzer (256 bands)
  fft = new p5.FFT(256);

  try {
    // 3. Load sound asynchronously in p5.js v2
    mSound = await loadSound('assets/PER_FINAL.mp3');
    
    // 4. Connect the sound file directly to the FFT analyzer
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio loading error:', err);
  }
}

function draw() {
  background(20);

  // 5. Get current frequency spectrum array
  let spectrum = fft ? fft.analyze() : [];

  // 6. Calculate normalized energy levels (0.0 to 1.0)
  let bass = energy(spectrum, 20, 250);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let orbitSpeed = frameCount * 0.01;
  lights();

  // Scene-wide camera rotations
  rotateY(frameCount * 0.005);
  rotateX(PI / 6 + sin(frameCount * 0.003) * 0.2);

  for (let i = 0; i < numShapes; i++) {
    // Calculate orbital positioning using sine and cosine
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.02);

    noStroke();

    // Alternate frequency reactivity across shapes
    if (i % 3 === 0) {
      fill(255, 100, 100);
      let bassSize = map(bass, 0, 1, 50, 160);
      box(bassSize);
    } else if (i % 3 === 1) {
      fill(100, 255, 100);
      let midSize = map(mid, 0, 1, 30, 110);
      sphere(midSize);
    } else {
      fill(100, 100, 255);
      let trebleSize = map(treble, 0, 1, 20, 80);
      torus(trebleSize, 15);
    }

    pop();
  }
}

// Helper function to average frequency energy in p5.sound v2
function energy(spectrum, lowHz, highHz) {
  if (!spectrum || spectrum.length === 0) return 0;
  let nyquist = getAudioContext().sampleRate / 2;
  let lo = floor((lowHz / nyquist) * spectrum.length);
  let hi = min(spectrum.length - 1, ceil((highHz / nyquist) * spectrum.length));
  let sum = 0;
  for (let i = lo; i <= hi; i++) sum += spectrum[i];
  let avg = sum / (hi - lo + 1);
  return constrain(map(20 * Math.log10(avg + 1e-6), -100, -10, 0, 1), 0, 1);
}

// Start looping audio when user clicks canvas
function mousePressed() {
  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}