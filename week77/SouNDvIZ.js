let mSound;
let fft;
let volumeSlider;
let numShapes = 30;
let baseRadius = 1000;

let bgVideo;
let myShader;
let particles = [];

// Asynchronous setup using p5.js v2
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT frequency analyzer (256 bands)
  fft = new p5.FFT(256);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(20, 20);

  // Load video element and loop playback
  bgVideo = createVideo(['assets/DSCN1412.mp4']);
  bgVideo.hide();
  bgVideo.volume(0); // Mute video so browser permits background looping

  try {
    // Load sound file and custom shaders asynchronously
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);

    myShader = await loadShader('shaders/myShader.vert', 'shaders/myShader.frag');
  } catch (err) {
    console.log('Asset loading error:', err);
  }
}

function draw() {
  background(20);

  // 1. Render Looping Video Background
  if (bgVideo) {
    push();
    resetMatrix();
    resetShader(); // Use default rendering for video background plane
    translate(0, 0, -1500);
    noStroke();
    texture(bgVideo);
    plane(width * 3, height * 3);
    pop();
  }

  orbitControl();

  if (mSound && mSound.isPlaying()) {
    let vol = volumeSlider.value() / 100;
    mSound.amp(vol);
  }

  // 2. Extract Frequency Spectrum & Energy Bands from MP3
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let currentRadius = baseRadius + map(mouseX, 0, width, -100, 100, true);
  let orbitSpeed = frameCount * 0.01;

  lights();

  // 3. Bind Custom Shader & Send Audio Uniforms to GPU
  if (myShader) {
    shader(myShader);
    myShader.setUniform('u_time', millis() * 0.001);
    myShader.setUniform('u_bass', bass);
    myShader.setUniform('u_treble', treble);
  }

  // 4. Render Orbiting 3D Shapes Ring
  for (let i = 0; i < numShapes; i++) {
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * currentRadius;
    let z = sin(angle) * currentRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.01);

    noStroke();

    if (i % 3 === 0) {
      let bassSize = map(bass, 0, 1, 50, 180);
      box(bassSize);
    } else if (i % 3 === 1) {
      let midSize = map(mid, 0, 1, 30, 130);
      sphere(midSize);
    } else {
      let trebleSize = map(treble, 0, 1, 20, 90);
      torus(trebleSize, 15);
    }

    pop();
  }

  // 5. Spawn & Update Treble Fading Particles
  if (treble > 0.35) {
    let count = floor(map(treble, 0.35, 1.0, 2, 8));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(0, 0, 0, treble));
    }
  }

  resetShader();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  // 6. Render Real-Time Audio Waveform Ring
  if (fft) {
    let waveform = fft.waveform();
    resetShader();
    noFill();
    stroke(100, 220, 255);
    strokeWeight(3);

    beginShape();
    let ringRadius = currentRadius * 0.6;
    for (let i = 0; i < waveform.length; i += 4) {
      let angle = map(i, 0, waveform.length, 0, TWO_PI);
      let r = ringRadius + waveform[i] * 120;
      let x = cos(angle) * r;
      let z = sin(angle) * r;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
  }
}

// 3D Fading Particle Class
class Particle {
  constructor(x, y, z, energyLevel) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(5, 15) * energyLevel);
    this.life = 255;
    this.size = random(8, 20);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 8;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(120, 220, 255, this.life);
    sphere(this.size);
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
  userStartAudio(); // Resume browser audio permissions
  if (bgVideo) {
    bgVideo.loop();
  }
  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    fullscreen(!fullscreen());
  }

  if (key === 'p' || key === 'P') {
    if (mSound && mSound.isPlaying()) {
      mSound.pause();
    } else if (mSound) {
      mSound.loop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}