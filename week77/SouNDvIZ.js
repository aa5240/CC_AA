let particles = [];
let mSound;
let fft;

// Use async setup for p5.js v2 asset loading
async function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(256);

  try {
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);
  } catch (err) {
    console.log('Audio load error:', err);
  }
}

function draw() {
  background(20);

  let spectrum = fft ? fft.analyze() : [];
  let treble = energy(spectrum, 2000, 12000);

  // Spawn new particles on high treble notes
  if (treble > 0.3) {
    particles.push(new Particle(width / 2, height / 2));
  }

  // Update, draw, and remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    // Remove particle once completely transparent
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Particle class definition
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 6));
    this.alpha = 255; // Initial opacity (255 = fully visible)
    this.size = random(6, 16);
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 4; // Fade out by decreasing alpha each frame
  }

  draw() {
    noStroke();
    // 4th parameter sets the fading opacity
    fill(100, 200, 255, this.alpha);
    circle(this.pos.x, this.pos.y, this.size);
  }
}

// Helper function to calculate frequency band averages
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
  userStartAudio();
  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}