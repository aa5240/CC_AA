let mSound;
let numShapes = 7;
let orbitRadius = 300;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Load sound asynchronously in p5.js v2
  try {
    mSound = await loadSound('PER_FINAL.mp3');
  } catch (err) {
    console.log('Audio loading error:', err);
  }
}

function draw() {
  background(20);

  // Enable mouse camera control and 3D lighting
  orbitControl();
  lights();

  let orbitSpeed = frameCount * 0.01;
  let pulse = sin(frameCount * 0.05) * 30; // Harmonic size pulse

  for (let i = 0; i < numShapes; i++) {
    // Calculate orbital ring coordinates around the center
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.02);

    fill((i * 45) % 360, 180, 220);
    noStroke();

    let size = 80 + pulse;

    // Alternate 3D geometry types across the orbital ring
    if (i % 3 === 0) {
      box(size);
    } else if (i % 3 === 1) {
      sphere(size * 0.6);
    } else {
      torus(size * 0.5, size * 0.2);
    }

    pop();
  }
}

function mousePressed() {
  // Trigger looping playback on user interaction
  if (mSound && mSound.isLoaded() && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}