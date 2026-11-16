let mSound;
let fft;
let particles = [];

let numShapes = 24;
let orbitRadius = 550;
let noiseScale = 0.005; // 1. Smooth noise sampling scale

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT analyzer with power-of-two bin count
  fft = new p5.FFT(2048);

  try {
    // Await audio asset loading asynchronously
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);
  orbitControl();

  // Extract frequency bands from FFT analyzer
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let treble = energy(spectrum, 2000, 12000);

  lights();

  // Render orbiting shapes
  let orbitSpeed = frameCount * 0.01;
  for (let i = 0; i < numShapes; i++) {
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    noStroke();
    fill(i % 2 === 0 ? color(255, 120, 160) : color(100, 210, 255));
    box(map(bass, 0, 1, 30, 90));
    pop();
  }

  // Emit audio-reactive particles
  if (bass > 0.4) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }
  if (treble > 0.3) {
    particles.push(new Particle(0, 0, 0, 'treble', treble));
  }

  // Update & apply Perlin noise forces to active particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].applyNoiseForce(bass); // 2. Apply organic noise force
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Noise-Driven 3D Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(2, 5) * intensity);
    this.acc = createVector(0, 0, 0);
    this.type = type;
    this.life = 255;
    this.col = type === 'bass' ? color(255, 100, 150) : color(100, 220, 255);
  }

  // Apply Perlin noise field force
  applyNoiseForce(audioBass) {
    // Sample 3D Perlin noise based on position and time
    let nX = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, frameCount * 0.01);
    let nY = noise(this.pos.y * noiseScale, this.pos.z * noiseScale, frameCount * 0.01 + 1000);
    let nZ = noise(this.pos.z * noiseScale, this.pos.x * noiseScale, frameCount * 0.01 + 2000);

    // Map noise values (0 to 1) to directional force vectors (-1 to 1)
    let noiseVec = createVector(
      map(nX, 0, 1, -1, 1),
      map(nY, 0, 1, -1, 1),
      map(nZ, 0, 1, -1, 1)
    );

    // Scale force by audio bass intensity for dynamic motion
    noiseVec.mult(0.2 + audioBass * 0.5);
    this.acc.add(noiseVec);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.life -= 5;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);
    sphere(this.type === 'bass' ? 20 : 8);
    pop();
  }
}

// Energy calculation helper for frequency bands
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