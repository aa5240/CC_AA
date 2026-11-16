let mSound;
let fft;
let particles = [];

// DOM UI Controls
let playButton;
let volumeSlider;

let numShapes = 24;
let orbitRadius = 550;

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(512);

  // 1. Create Play/Pause Button
  playButton = createButton('Play');
  playButton.position(20, 20);
  playButton.mouseClicked(togglePlay);

  // 2. Create Volume Slider (Range 0 to 100, starting at 50)
  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(90, 20);

  try {
    // Load audio asynchronously with await
    mSound = await loadSound('week77/assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);

  // 3. Live Volume Amplitude Reading
  if (mSound) {
    let vol = volumeSlider.value() / 100.0;
    mSound.amp(vol);
  }

  orbitControl();
  lights();

  // Extract Audio Frequency Energy
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let treble = energy(spectrum, 2000, 12000);

  // 4. Render Orbiting Ring
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

  // 5. Emit Audio-Reactive Particles
  if (bass > 0.45) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }

  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Custom Function to Toggle Play & Pause States
function togglePlay() {
  userStartAudio(); // Unlock browser Web Audio context
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

// 3D Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(2, 6) * intensity);
    this.life = 255;
    this.col = color(255, 100, 150);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);
    box(30);
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