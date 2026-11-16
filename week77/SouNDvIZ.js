let mSound;
let fft;
let particles = [];
let playButton;
let volumeSlider;

const numShapes = 100;
const orbitRadius = 550;
const audioPath = 'assets/PER_FINAL.mp3';

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // 1. Switch to HSB color mode (Hue: 0-360, Saturation: 0-100, Brightness: 0-100)
  colorMode(HSB, 360, 100, 100);

  fft = new p5.FFT(512);

  playButton = createButton('Loading audio...');
  playButton.position(20, 20);
  playButton.elt.disabled = true;
  playButton.mouseClicked(togglePlay);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(140, 20);
  volumeSlider.input(updateVolume);

  try {
    mSound = await loadSound(audioPath);
    mSound.connect(fft);
    updateVolume();

    playButton.html('Play');
    playButton.elt.disabled = false;
  } catch (error) {
    console.error(`Could not load audio: ${audioPath}`, error);
    playButton.html('Audio failed to load');
  }
}

function draw() {
  // Dark background in HSB mode (Hue 240 = deep navy)
  background(240, 40, 10);
  orbitControl();
  lights();

  let bass = 0, treble = 0;

  if (mSound && mSound.isPlaying()) {
    let spectrum = fft.analyze();
    bass = energy(spectrum, 20, 250);
    treble = energy(spectrum, 2000, 12000);
  }

  // 2. Map pitch energy to dynamic HSB hues
  let bassHue = map(bass, 0, 1, 300, 360);     // Shift from Magenta to Red on bass hits
  let trebleHue = map(treble, 0, 1, 160, 240); // Shift from Cyan to Blue on treble hits

  const orbitSpeed = frameCount * 0.01;

  for (let i = 0; i < numShapes; i++) {
    const angle = (TWO_PI / numShapes) * i + orbitSpeed;
    const x = cos(angle) * orbitRadius;
    const z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    noStroke();

    // Alternate smooth color transitions based on audio frequency energy
    if (i % 2 === 0) {
      fill(bassHue, 85, 100);
      box(map(bass, 0, 1, 30, 90));
    } else {
      fill(trebleHue, 85, 100);
      sphere(map(treble, 0, 1, 20, 60));
    }
    pop();
  }

  // 3. Trigger Beat-Reactive Particles
  if (mSound && mSound.isPlaying() && bass > 0.45) {
    particles.push(new Particle(0, 0, 0, bassHue, bass));
  }

  // Update & Render Active Particles
  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// HSB Audio-Reactive Particle Class
class Particle {
  constructor(x, y, z, hueVal, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(2, 6) * intensity);
    this.life = 255;
    this.hue = hueVal;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    // Pass alpha transparency smoothly in HSB
    fill(this.hue, 85, 100, map(this.life, 0, 255, 0, 1));
    box(30);
    pop();
  }
}

function energy(spectrum, lowHz, highHz) {
  if (!spectrum || spectrum.length === 0) return 0;

  const nyquist = getAudioContext().sampleRate / 2;
  const lastBin = spectrum.length - 1;
  const lowBin = constrain(floor((lowHz / nyquist) * spectrum.length), 0, lastBin);
  const highBin = constrain(ceil((highHz / nyquist) * spectrum.length), 0, lastBin);

  if (highBin < lowBin) return 0;

  let sum = 0;
  for (let i = lowBin; i <= highBin; i++) {
    sum += spectrum[i];
  }

  const average = sum / (highBin - lowBin + 1);
  return constrain(map(20 * Math.log10(average + 1e-6), -100, -10, 0, 1), 0, 1);
}

async function togglePlay() {
  if (!mSound) return;
  try {
    await userStartAudio();
    if (mSound.isPlaying()) {
      mSound.pause();
      playButton.html('Play');
    } else {
      mSound.loop();
      playButton.html('Pause');
    }
  } catch (error) {
    console.error('Playback error:', error);
  }
}

function updateVolume() {
  if (mSound && volumeSlider) {
    mSound.amp(Number(volumeSlider.value()) / 100, 0.05);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}