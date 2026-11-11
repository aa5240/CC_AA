let mSound;
let mic;
let fft;
let volumeSlider;
let useMic = false;
let numShapes = 30;
let baseRadius = 1000;

let bgVideo;
let myShader;

// Array to hold active treble particles
let particles = [];

// Asynchronous setup using p5.js v2
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fft = new p5.FFT(256);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(20, 20);

  // Load looping background video
  bgVideo = createVideo(['assets/DSCN1414.mp4']);
  bgVideo.hide();
  bgVideo.loop();

  try {
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
    resetShader();
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

  // Extract sound frequencies
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let currentRadius = baseRadius + map(mouseX, 0, width, -100, 100, true);
  let orbitSpeed = frameCount * 0.01;

  lights();

  // 2. Render 3D Shapes with Custom Shader
  if (myShader) {
    shader(myShader);
    myShader.setUniform('u_time', millis() * 0.001);
    myShader.setUniform('u_bass', bass);
    myShader.setUniform('u_treble', treble);
  }

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

  // 3. Spawn Treble Burst Particles
  if (treble > 0.35) {
    let spawnCount = floor(map(treble, 0.35, 1.0, 2, 8));
    for (let i = 0; i < spawnCount; i++) {
      particles.push(new Particle(0, 0, 0, treble));
    }
  }

  // 4. Update and Draw 3D Fading Particles
  resetShader(); // Reset shader for particle rendering
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// 3D Fading Particle Class Definition
class Particle {
  constructor(x, y, z, energyLevel) {
    this.pos = createVector(x, y, z);
    // Random 3D direction vector scaled by treble energy
    this.vel = p5.Vector.random3D().mult(random(5, 15) * energyLevel);
    this.life = 255;
    this.size = random(8, 20);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 8; // Fade transparency over time
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

// Frequency energy calculation helper
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
  if (mSound && !mSound.isPlaying() && !useMic) {
    mSound.loop();
  }
}

function keyPressed() {
  if (key === 'f' || key === 'F') {
    fullscreen(!fullscreen());
  }

  if (key === 'm' || key === 'M') {
    if (!useMic) {
      mic = new p5.AudioIn();
      mic.disconnect();
      mic.start();
      mic.connect(fft);
      if (mSound && mSound.isPlaying()) mSound.pause();
      useMic = true;
    } else {
      if (mic) mic.stop();
      if (mSound) mSound.loop();
      useMic = false;
    }
  }

  if (key === ' ') {
    if (mSound.isPlaying()) {
      mSound.pause();
    } else {
      mSound.loop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}