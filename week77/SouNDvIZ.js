let mSound;
let fft;
let particles = [];

let numShapes = 100;
let orbitRadius = 1000;

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT frequency analyzer
  fft = new p5.FFT(256);

  try {
    // Await loading sound file asynchronously
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);
  orbitControl();

  // 1. Analyze Audio Frequencies
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  lights();

  // 2. Render Orbiting Ring
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

    if (i % 2 === 0) {
      fill(255, 120, 160);
      box(map(bass, 0, 1, 30, 110));
    } else {
      fill(100, 210, 255);
      sphere(map(treble, 0, 1, 20, 75));
    }
    pop();
  }

  // 3. Emit Audio-Reactive Particles
  if (bass > 0.45) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }

  if (mid > 0.40) {
    particles.push(new Particle(0, 0, 0, 'mid', mid));
  }

  if (treble > 0.35) {
    let sparkCount = floor(map(treble, 0.35, 1.0, 2, 6));
    for (let i = 0; i < sparkCount; i++) {
      particles.push(new Particle(0, 0, 0, 'treble', treble));
    }
  }

  // 4. Update, Apply Physics, and Draw Active Particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    // Environmental forces: gentle downward gravity & slight horizontal wind
    let gravity = createVector(0, 0.12, 0);
    let wind = createVector(sin(frameCount * 0.02) * 0.05, 0, 0.02);

    particles[i].applyForce(gravity);
    particles[i].applyForce(wind);

    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Physics-Driven 3D Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0); // Force accumulator
    this.type = type;
    this.life = 255;

    if (this.type === 'bass') {
      this.vel = p5.Vector.random3D().mult(random(2, 6) * intensity);
      this.size = random(25, 55);
      this.fadeRate = 4;
      this.col = color(255, 100, 150);
    } else if (this.type === 'mid') {
      this.vel = createVector(random(-3, 3), random(-6, -2), random(-3, 3)).mult(intensity);
      this.size = random(15, 30);
      this.fadeRate = 6;
      this.col = color(150, 255, 120);
    } else {
      this.vel = p5.Vector.random3D().mult(random(8, 20) * intensity);
      this.size = random(4, 12);
      this.fadeRate = 12;
      this.col = color(100, 220, 255);
    }
  }

  // Accumulate incoming environmental force vectors
  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc); // Add acceleration to velocity
    this.pos.add(this.vel); // Move particle by velocity
    this.acc.mult(0);       // Reset acceleration for next frame
    this.life -= this.fadeRate;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);

    if (this.type === 'bass') {
      box(this.size);
    } else if (this.type === 'mid') {
      rotateX(frameCount * 0.05);
      torus(this.size, 6);
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