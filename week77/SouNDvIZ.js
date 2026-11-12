let mSound;
let fft;
let volumeSlider;
let numShapes = 30;
let baseRadius = 1000;

let bgVideo;
let myShader;


async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize FFT analyzer for spectrum and waveform analysis
  fft = new p5.FFT(256);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(20, 20);

  // Load looping background video
  bgVideo = createVideo(['assets/DSCN1412.mp4']);
  bgVideo.hide();
  bgVideo.volume(0); // Mute video for browser autoplay

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

  // 1. Render Video Background
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

  // 2. Extract Frequency Spectrum & Energy Bands
  let spectrum = fft ? fft.analyze() : [];
  let bass = energy(spectrum, 20, 500);
  let mid = energy(spectrum, 250, 2000);
  let treble = energy(spectrum, 2000, 12000);

  let currentRadius = baseRadius + map(mouseX, 0, width, -100, 100, true);
  let orbitSpeed = frameCount * 0.01;

  lights();

  // 3. Render 3D Shapes with Custom Shader
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

  // 4. Render Real-Time Audio Waveform Ring
  if (fft) {
    let waveform = fft.waveform(); // Get raw audio wave samples (-1 to 1)

    resetShader(); // Ensure clean stroke rendering without shape shader
    noFill();
    stroke(100, 220, 255);
    strokeWeight(3);

    beginShape();
    let ringRadius = currentRadius * 0.6;
    for (let i = 0; i < waveform.length; i += 4) {
      let angle = map(i, 0, waveform.length, 0, TWO_PI);
      
      // Modulate ring radius using real-time audio wave amplitude
      let r = ringRadius + waveform[i] * 120;
      let x = cos(angle) * r;
      let z = sin(angle) * r;

      vertex(x, 0, z);
    }
    endShape(CLOSE);
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