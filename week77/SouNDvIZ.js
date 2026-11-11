let mSound;
let mic;
let fft;
let volumeSlider;
let useMic = false;
let numShapes = 30;
let baseRadius = 1000;
let videos = [];
let videoNames = [
  'DSCN1718', 'DSCN1719', 'DSCN1720', 'DSCN1721', 'DSCN1723', 'DSCN1724', 'DSCN1725',
  'DSCN1726', 'DSCN1727', 'DSCN1728', 'DSCN1729', 'DSCN1730', 'DSCN1731', 'DSCN1733', 
  'DSCN1734', 'DSCN1735', 'DSCN1736', 'DSCN1737', 'DSCN1738', 'DSCN1739', 'DSCN1495', 
  'DSCN1403', 'DSCN1404', 'DSCN1405', 'DSCN1406', 'DSCN1407', 'DSCN1409', 'DSCN1410', 
  'DSCN1411', 'DSCN1412', 'DSCN1413' ]

// Global variables for video background and custom shader
let bgVideo;
let myShader;

// Asynchronous setup using p5.js v2
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT frequency analyzer
  fft = new p5.FFT(256);

  // Output volume slider UI
  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(20, 20);

  // Load video element, hide HTML tag, and start looping
  bgVideo = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
  bgVideo.hide();
  bgVideo.loop();
  

  // Load sound and GLSL shaders asynchronously
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

  // 1. Draw looping video background in WebGL 3D
  if (bgVideo) {
    push();
    resetMatrix(); // Reset camera matrix so background stays fixed
    translate(0, 0, -1500); // Position behind orbiting 3D scene
    noStroke();
    texture(bgVideo);
    plane(width * 3, height * 3);
    pop();
  }

  // Enable 3D camera controls
  orbitControl();

  // Adjust volume output from slider
  if (mSound && mSound.isPlaying()) {
    let vol = volumeSlider.value() / 100;
    mSound.amp(vol);
  }

  // Extract frequency spectrum
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let currentRadius = baseRadius + map(mouseX, 0, width, -100, 100, true);
  let orbitSpeed = frameCount * 0.01;

  lights();

  // 2. Bind custom GLSL shader and pass audio frequency uniforms to GPU
  if (myShader) {
    shader(myShader);
    myShader.setUniform('u_time', millis() * 0.001);
    myShader.setUniform('u_bass', bass);
    myShader.setUniform('u_treble', treble);
  }

  // 3. Render 3D audio-reactive geometry ring
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
      fill(255, 100, 100);
      let bassSize = map(bass, 0, 1, 50, 180);
      box(bassSize);
    } else if (i % 3 === 1) {
      fill(100, 255, 100);
      let midSize = map(mid, 0, 1, 30, 130);
      sphere(midSize);
    } else {
      fill(100, 100, 255);
      let trebleSize = map(treble, 0, 1, 20, 90);
      torus(trebleSize, 15);
    }

    pop();
  }
}

// Frequency band averaging helper
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