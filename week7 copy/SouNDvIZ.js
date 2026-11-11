// Global variables for audio, analyzer, and 3D cube objects
let mSound;
let amplitude;
let cubes = [];

let videoNames = [
  'DSCN1718', 'DSCN1719', 'DSCN1720', 'DSCN1721', 'DSCN1723', 'DSCN1724', 'DSCN1725',
  'DSCN1726', 'DSCN1727', 'DSCN1728', 'DSCN1729', 'DSCN1730', 'DSCN1731', 'DSCN1733'
];

// Custom class to encapsulate 3D video cube state and drawing
class VideoCube {
  constructor(angle, radius, baseSize, videoElement) {
    this.baseAngle = angle;
    this.orbitRadius = radius;
    this.y = 0;
    this.baseSize = baseSize;
    this.video = videoElement;
  }

  // Draw and animate the cube in 3D WebGL space
  display(orbitSpeed, pulseBoost) {
    push();
    let currentAngle = this.baseAngle + orbitSpeed;
    let currentX = cos(currentAngle) * this.orbitRadius;
    let currentZ = sin(currentAngle) * this.orbitRadius;

    translate(currentX, this.y, currentZ);
    rotateY(-currentAngle);

    texture(this.video);
    noStroke();

    // Pulse size dynamically based on audio volume
    box(this.baseSize + pulseBoost);
    pop();
  }
}

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize audio amplitude analyzer
  amplitude = new p5.Amplitude();

  // Load sound asynchronously in p5.js v2
  try {
    mSound = await loadSound('PER_FINAL.mp3');
  } catch (err) {
    console.log('Audio file failed to load:', err);
  }

  // Instantiate VideoCube objects in a circular orbit
  let total = videoNames.length;
  let orbitRadius = 600;

  for (let i = 0; i < total; i++) {
    let name = videoNames[i];
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
    v.volume(0);  // Mute video track for browser autoplay rules
    v.loop();     // Loop video continuously
    v.hide();     // Hide default DOM element

    let baseAngle = (TWO_PI / total) * i;
    cubes.push(new VideoCube(baseAngle, orbitRadius, 200, v));
  }
}

function draw() {
  background(30);

  // Enable WebGL mouse camera navigation
  orbitControl();
  lights();

  // Read volume level and calculate size pulse
  let level = amplitude ? amplitude.getLevel() : 0;
  let pulseBoost = map(level, 0, 1, 0, 150);
  let orbitSpeed = frameCount * 0.001;

  // Render every VideoCube instance
  for (let cube of cubes) {
    cube.display(orbitSpeed, pulseBoost);
  }
}

function mousePressed() {
  userStartAudio();

  if (mSound && mSound.isLoaded() && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}