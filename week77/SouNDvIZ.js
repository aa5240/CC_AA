let mSound;
let fft;
let volumeSlider;

let bgVideo;
let myShader;
let particles = [];

let numShapes = 35;
let baseRadius = 1000;

// Asynchronous setup using p5.js v2
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT frequency analyzer
  fft = new p5.FFT(256);

  volumeSlider = createSlider(0, 100, 30);
  volumeSlider.position(20, 20);

  // Load background video element
  bgVideo = createVideo(['assets/DSCN1412.mp4']);
  bgVideo.hide();
  bgVideo.volume(0); // Mute background video element

  try {
    // Await audio and shader asset loading
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft);

    myShader = await loadShader('shaders/myShader.vert', 'shaders/myShader.frag');
  } catch (err) {
    console.log('Asset loading error:', err);
  }
}

function draw() {
  background(20);

  if (mSound && mSound.isPlaying()) {
    let vol = volumeSlider.value() / 100;
    mSound.amp(vol);
  }

  // 1. Draw Looping Video Background Plane
  if (bgVideo) {
    push();
    resetMatrix();
    resetShader(); // Use default rendering for video plane
    translate(0, 0, -1500);
    noStroke();
    texture(bgVideo);
    plane(width * 3, height * 3);
    pop();
  }

  orbitControl();

  // 2. Extract Audio Frequency Energy Bands
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let currentRadius = baseRadius + map(mouseX, 0, width, -100, 100, true);
  let orbitSpeed = frameCount * 0.01;

  lights();

  // 3. Render 3D Shapes with Video Textures & Shader
  for (let i = 0; i < numShapes; i++) {
    let angle = (TWO_PI / numShapes) * i + orbitSpeed;
    let x = cos(angle) * currentRadius;
    let z = sin(angle) * currentRadius;

    push();
    translate(x, 0, z);
    rotateY(-angle);
    rotateX(frameCount * 0.015);
    noStroke();

    if (i % 2 === 0 && myShader) {
      shader(myShader);
      myShader.setUniform('u_time', millis() * 0.001);
      myShader.setUniform('u_bass', bass);
      myShader.setUniform('u_treble', treble);
    } else if (bgVideo) {
      resetShader();
      texture(bgVideo);
    }

    if (i % 5 === 0) {
      let boxSize = map(bass, 0, 1, 50, 180);
      box(boxSize);
    } else if (i % 5 === 1) {
      let sphereSize = map(mid, 0, 1, 30, 130);
      sphere(sphereSize);
    } else if (i % 5 === 2) {
      let torusSize = map(treble, 0, 1, 20, 90);
      torus(torusSize, 15);
    } else if (i % 5 === 3) {
      let cylRadius = map(bass, 0, 1, 25, 70);
      let cylHeight = map(mid, 0, 1, 60, 160);
      cylinder(cylRadius, cylHeight);
    } else {
      let coneRadius = map(treble, 0, 1, 20, 80);
      let coneHeight = map(bass, 0, 1, 50, 150);
      cone(coneRadius, coneHeight);
    }

    pop();
  }

  // 4. Treble Burst Particle System
  if (treble > 0.35) {
    let spawnCount = floor(map(treble, 0.35, 1.0, 2, 8));
    for (let i = 0; i < spawnCount; i++) {
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

  // 5. Audio Waveform Ring
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

// 3D Particle Class Definition
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

// Frequency energy calculation helper for p5.sound v2
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