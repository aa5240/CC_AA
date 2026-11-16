let mSound;
let fft;
let particles = [];
let playButton;
let volumeSlider;

const numShapes = 100;
const orbitRadius = 550;
const audioPath = 'assets/PER_FINAL.mp3';

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(0.8, 512);

  playButton = createButton('Loading audio...');
  playButton.position(20, 20);
  playButton.elt.disabled = true;
  playButton.mouseClicked(togglePlay);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(140, 20);
  volumeSlider.input(updateVolume);

  try {
    mSound = await loadSound(audioPath);
    fft.setInput(mSound);
    updateVolume();

    playButton.html('Play');
    playButton.elt.disabled = false;
    console.log(`Audio loaded: ${audioPath}`);
  } catch (error) {
    console.error(`Could not load audio: ${audioPath}`, error);
    playButton.html('Audio failed to load');
  }
}

function draw() {
  background(15, 15, 25);
  orbitControl();
  lights();

  let bass = 0;

  if (mSound && mSound.isPlaying()) {
    bass = energy(fft.analyze(), 20, 250);
  }

  const orbitSpeed = frameCount * 0.01;

  for (let i = 0; i < numShapes; i++) {
    const angle = (TWO_PI / numShapes) * i + orbitSpeed;
    const x = cos(angle) * orbitRadius;
    const z = sin(angle) * orbitRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    noStroke();
    fill(i % 2 === 0 ? color(0, 120, 160) : color(0, 210, 255));
    box(map(bass, 0, 1, 30, 90));
    pop();
  }

  if (mSound && mSound.isPlaying() && bass > 0.45) {
    particles.push(new Particle(0, 0, 0, bass));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
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
    console.error('Could not start audio playback:', error);
    playButton.html('Playback error');
  }
}

function updateVolume() {
  if (mSound && volumeSlider) {
    mSound.amp(Number(volumeSlider.value()) / 100, 0.05);
  }
}

class Particle {
  constructor(x, y, z, intensity) {
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
  return constrain(average / 255, 0, 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}