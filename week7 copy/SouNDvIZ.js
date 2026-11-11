// Global variables for audio, analyzer, and 3D objects
let mSound;
let amplitude;
let shapeObjects = [];

let videoNames = [
  'DSCN1718', 'DSCN1719', 'DSCN1720', 'DSCN1721', 'DSCN1723', 'DSCN1724', 'DSCN1725'
];

// Class to manage 3D orbital object movement and shape morphing
class MorphingObject {
  constructor(angle, radius, baseSize, videoElement) {
    this.baseAngle = angle;
    this.orbitRadius = radius;
    this.baseSize = baseSize;
    this.video = videoElement;
  }

  display(orbitSpeed, pulseBoost, volumeLevel) {
    push();
    let currentAngle = this.baseAngle + orbitSpeed;
    let currentX = cos(currentAngle) * this.orbitRadius;
    let currentZ = sin(currentAngle) * this.orbitRadius;

    translate(currentX, 0, currentZ);
    rotateY(-currentAngle);
    rotateX(frameCount * 0.01);

    // Apply video texture to 3D geometry
    if (this.video) {
      texture(this.video);
    }
    noStroke();

    let size = this.baseSize + pulseBoost;

    // Morph 3D geometry based on audio volume thresholds
    if (volumeLevel > 0.4) {
      torus(size * 0.6, size * 0.2);
    } else if (volumeLevel > 0.25) {
      cylinder(size * 0.5, size);
    } else if (volumeLevel > 0.1) {
      sphere(size * 0.6);
    } else {
      box(size);
    }

    pop();
  }
}

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize amplitude analyzer
  amplitude = new p5.Amplitude();

  // Load sound asynchronously in p5.js v2
  try {
    mSound = await loadSound('PER_FINAL.mp3');
  } catch (err) {
    console.log('Audio file load error:', err);
  }

  let total = videoNames.length;
  let orbitRadius = 600;

  for (let i = 0; i < total; i++) {
    let name = videoNames[i];
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
    v.volume(0);  // Mute video audio for browser autoplay rules
    v.loop();     // Continuously loop video
    v.hide();     // Hide raw HTML element

    let baseAngle = (TWO_PI / total) * i;
    shapeObjects.push(new MorphingObject(baseAngle, orbitRadius, 180, v));
  }
}

function draw() {
  background(20);

  // Enable mouse camera navigation in 3D WebGL space
  orbitControl();
  lights();

  let level = amplitude ? amplitude.getLevel() : 0;
  let pulseBoost = map(level, 0, 1, 0, 150);
  let orbitSpeed = frameCount * 0.001;

  // Render each morphing 3D object
  for (let obj of shapeObjects) {
    obj.display(orbitSpeed, pulseBoost, level);
  }
}

function mousePressed() {
  // Resume browser audio context on click
  userStartAudio();

  if (mSound && mSound.isLoaded() && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}