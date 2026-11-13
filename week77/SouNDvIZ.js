let mSound;
let fft;
let particles = [];

// DOM UI Controls
let playButton;
let volumeSlider;

let numShapes = 86;
let orbitRadius = 600;

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(1000);

  // 1. Create Play/Pause Button
  playButton = createButton('Play');
  playButton.position(20, 20);
  playButton.mouseClicked(togglePlay);

  // 2. Create Volume Slider (0 to 100, starting at 30)
  volumeSlider = createSlider(0, 100, 30);
  volumeSlider.position(90, 20);

  try {
    // Load audio asynchronously with await
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);

  // 3. Apply Live Volume Slider Reading to Sound Output
  if (mSound) {
    let vol = volumeSlider.value() / 100;
    mSound.amp(vol);
  }

  orbitControl();

  // Extract Audio Frequencies
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  lights();

  // Render Orbiting Shapes Ring
  let orbitSpeed = frameCount * 0.01;
  for (let i = 0; i < numShapes; i++) {
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * orbitRadius;
    let z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.005);
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

  // Particle Triggers
  if (bass > 0.10) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }
  if (mid > 0.10) {
    particles.push(new Particle(0, 0, 0, 'mid', mid));
  }
  if (treble > 0.10) {
    let sparkCount = floor(map(treble, 0.35, 1.0, 2, 6));
    for (let i = 0; i < sparkCount; i++) {
      particles.push(new Particle(0, 0, 0, 'treble', treble));
    }
  }

  // Update Particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// 4. Custom Function to Toggle Sound Play & Pause State
function togglePlay() {
  userStartAudio(); // Unlock browser audio context
  if (mSound) {
    if (mSound.isPlaying()) {
      mSound.pause();
      playButton.html('Play');
    } else {
      mSound.loop();
      playButton.html('Pause');
    }
  }
}

// Physics Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.type = type;
    this.life = 1000;

    if (this.type === 'bass') {
      this.vel = p5.Vector.random3D().mult(random(0.5, 15) * intensity);
      this.size = random(10, 80);
      this.fadeRate = 4;
      this.col = color(255, 100, 150);
    } else if (this.type === 'mid') {
      this.vel = createVector(random(-3, 3), random(-6, -2), random(-3, 3)).mult(intensity);
      this.size = random(15, 30);
      this.fadeRate = 6;
      this.col = color(150, 255, 120);
    } else {
      this.vel = p5.Vector.random3D().mult(random(0.5, 20) * intensity);
      this.size = random(10, 60);
      this.fadeRate = 5;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}