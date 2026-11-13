let mSound;
let fft;
let particles = [];

// Orbiting ring configuration
let numShapes = 24;
let orbitRadius = 550;

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(256);

  try {
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);
  orbitControl(); // Interactive mouse camera controls

  // 1. Analyze Audio Frequencies
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let treble = energy(spectrum, 2000, 12000);

  lights();

  // 2. Render Orbiting Ring of Audio-Reactive 3D Shapes
  let orbitSpeed = frameCount * 0.01;
  for (let i = 0; i < numShapes; i++) {
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.015);
    noStroke();

    // Alternate shapes and colors reacting to bass & treble energy
    if (i % 2 === 0) {
      fill(255, 120, 160);
      let bassBoxSize = map(bass, 0, 1, 30, 110);
      box(bassBoxSize);
    } else {
      fill(100, 210, 255);
      let trebleSphereSize = map(treble, 0, 1, 20, 75);
      sphere(trebleSphereSize);
    }
    pop();
  }

  // 3. Trigger Heavy Bass Cube Pulses from Center
  if (bass > 0.45) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }

  // 4. Trigger High Treble Sparkle Bursts from Center
  if (treble > 0.35) {
    let sparkCount = floor(map(treble, 0.35, 1.0, 2, 6));
    for (let i = 0; i < sparkCount; i++) {
      particles.push(new Particle(0, 0, 0, 'treble', treble));
    }
  }

  // 5. Update, Render, and Clean Up Active Particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Multi-Behavior 3D Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.type = type;
    this.life = 255;

    if (this.type === 'bass') {
      // Bass: Larger 3D shapes that float slowly
      this.vel = p5.Vector.random3D().mult(random(2, 6) * intensity);
      this.size = random(25, 55);
      this.fadeRate = 4;
      this.col = color(255, 100, 150);
    } else {
      // Treble: High-speed tiny sparks that fade fast
      this.vel = p5.Vector.random3D().mult(random(8, 20) * intensity);
      this.size = random(4, 12);
      this.fadeRate = 12;
      this.col = color(100, 220, 255);
    }
  }

  update() {
    this.pos.add(this.vel);
    this.life -= this.fadeRate;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);

    if (this.type === 'bass') {
      box(this.size);
    } else {
      sphere(this.size);
    }
    pop();
  }
}

// Frequency energy helper for p5.sound v2
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
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  } else if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}