let mSound;
let fft;
let numShapes = 7;
let orbitRadius = 300;

async function setup() {
  // Initialize 3D canvas in WEBGL mode
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT frequency analyzer
  fft = new p5.FFT();

  // Load sound asynchronously in p5.js v2
  try {
    mSound = await loadSound('PER_FINAL.mp3');
    userStartAudio();
    if (mSound) {
      mSound.loop(); // Start looping audio automatically once loaded
    }
  } catch (err) {
    console.log('Audio loading error:', err);
  }
}

function draw() {
  background(20);
  if (fft) {
    fft.analyze();
  }

  // Extract volume energy for frequency bands (0 to 255)
   let bass = fft ? fft.getEnergy('bass') : 0;
  let mid = fft ? fft.getEnergy('mid') : 0;
  let treble = fft ? fft.getEnergy('treble') : 0;

  let orbitSpeed = frameCount * 0.01;
  // Autonomous 3D lighting
  lights();

  // Scene-wide camera rotations (Y spin + dynamic X tilt)
  rotateY(frameCount * 0.005);
  rotateX(PI / 6 + sin(frameCount * 0.003) * 0.2);


  for (let i = 0; i < numShapes; i++) {
    // Calculate orbital positioning using sine and cosine
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    // Isolate 3D transforms per object
    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.02);

    noStroke();

    // Alternate frequency reactivity across shapes
    if (i % 3 === 0) {
      fill(255, 100, 100);
      let bassSize = map(bass, 0, 255, 50, 160);
      box(bassSize);
    } else if (i % 3 === 1) {
      fill(100, 255, 100);
      let midSize = map(mid, 0, 255, 30, 110);
      sphere(midSize);
    } else {
      fill(100, 100, 255);
      let trebleSize = map(treble, 0, 255, 20, 80);
      torus(trebleSize, 15);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}