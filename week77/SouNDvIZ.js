let mSound;
let fft;

// Asynchronous asset loading in p5.js v2
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fft = new p5.FFT(256);

  try {
    // Make sure the path matches your folder structure exactly
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
    console.log("Audio file loaded successfully!");
  } catch (err) {
    console.log("Audio loading error:", err);
  }
}

function draw() {
  background(30);

  // Test 3D visual geometry
  orbitControl();
  
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);

  normalMaterial();
  push();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(100 + bass * 150); // Box grows when bass hits
  pop();

  // On-screen feedback text
  if (!mSound || !mSound.isPlaying()) {
    push();
    resetMatrix();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Click anywhere on the canvas to start audio", 0, 0);
    pop();
  }
}

// Helper function to average frequency energy
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

function mousePressed() {
  userStartAudio(); // Resume browser audio permissions
  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}