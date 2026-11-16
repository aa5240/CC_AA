let mSound;
let fft;
let delay;
let reverb;
let particles = [];

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(512);

  // 1. Create Spatial Audio Effects
  delay = new p5.Delay(0.25, 0.4); // 0.25s delay time, 40% feedback
  reverb = new p5.Reverb();         // Lush 3D reverberation

  try {
    // 2. Load Audio File Asynchronously
    mSound = await loadSound('assets/PER_FINAL.mp3');

    // Route Audio: mSound -> Delay -> Reverb -> FFT / Speakers
    mSound.disconnect();
    mSound.connect(delay);
    delay.connect(reverb);
    reverb.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(15, 15, 25);
  orbitControl();

  // 3. Dynamically Modulate Delay Feedback with Mouse Y Position
  let feedbackAmount = map(mouseY, 0, height, 0.7, 0.1, true);
  if (delay) {
    delay.feedback(feedbackAmount);
  }

  // Analyze Audio Frequencies
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 250);
  let treble = energy(spectrum, 2000, 12000);

  lights();

  // Visual Core: Pulse size with bass energy
  push();
  noStroke();
  fill(255, 150, 180);
  sphere(35 + bass * 85);
  pop();

  // Emit 3D Particles on Beat Hits
  if (bass > 0.45) {
    particles.push(new Particle(0, 0, 0, 'bass', bass));
  }
  if (treble > 0.35) {
    particles.push(new Particle(0, 0, 0, 'treble', treble));
  }

  // Render & Update Active Particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// 3D Particle Class
class Particle {
  constructor(x, y, z, type, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(3, 8) * intensity);
    this.type = type;
    this.life = 255;
    this.col = type === 'bass' ? color(255, 100, 150) : color(100, 220, 255);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 6;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.life);
    if (this.type === 'bass') {
      box(30);
    } else {
      sphere(10);
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
    userStartAudio(); // Resume browser audio context [5, 6]
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