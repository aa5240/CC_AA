// Code references used throughout this sketch:
// [1] p5.js shaders: https://p5js.org/reference/p5/loadShader/,
//     https://p5js.org/reference/p5/shader/, https://p5js.org/reference/p5/resetShader/,
//     https://p5js.org/reference/p5.Shader/setUniform/
// [2] p5.js canvas and WebGL: https://p5js.org/reference/p5/createCanvas/,
//     https://p5js.org/reference/p5/colorMode/, https://p5js.org/reference/p5/background/,
//     https://p5js.org/reference/p5/orbitControl/, https://p5js.org/reference/p5/lights/
// [3] p5.sound FFT and SoundFile APIs: https://github.com/processing/p5.js-sound/blob/master/lib/p5.sound.js
// [4] p5.js math and timing: https://p5js.org/reference/p5/map/,
//     https://p5js.org/reference/p5/min/, https://p5js.org/reference/p5/cos/,
//     https://p5js.org/reference/p5/sin/, https://p5js.org/reference/p5/millis/,
//     https://p5js.org/reference/p5/frameCount/
// [5] p5.js shape drawing and transforms: https://p5js.org/reference/p5/push/,
//     https://p5js.org/reference/p5/pop/, https://p5js.org/reference/p5/translate/,
//     https://p5js.org/reference/p5/rotateZ/, https://p5js.org/reference/p5/noStroke/,
//     https://p5js.org/reference/p5/fill/, https://p5js.org/reference/p5/box/,
//     https://p5js.org/reference/p5/sphere/
// [6] p5.js vectors and random values: https://p5js.org/reference/p5/createVector/,
//     https://p5js.org/reference/p5.Vector/random3D/, https://p5js.org/reference/p5/random/
// [7] p5.js controls and resizing: https://p5js.org/reference/p5/createButton/,
//     https://p5js.org/reference/p5/createSlider/, https://p5js.org/reference/p5/windowResized/,
//     https://p5js.org/reference/p5/resizeCanvas/
let mSound;
let fft;
let visualShader;
let particles = [];
let playButton;
let volumeSlider;

const numShapes = 100;
const audioPath = 'assets/PER_FINAL.mp3';


// [1] Load the vertex and fragment shaders before setup.
function preload() {
  visualShader = loadShader('shaders/myShader.vert', 'shaders/myShader.frag');
}

// Initialize the canvas, sound controls, and FFT analysis.
// [2][3][7] Set up the WebGL canvas, audio analysis, playback controls, and track.
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // 1. Switch to HSB color mode (Hue: 0-360, Saturation: 0-100, Brightness: 0-100)
  colorMode(HSB, 360, 100, 100);

  fft = new p5.FFT(0.8, 512); // [3] Use p5.sound FFT analysis with smoothing.

  playButton = createButton('Loading audio...');
  playButton.position(20, 20);
  playButton.elt.disabled = true;
  playButton.mouseClicked(togglePlay);

  volumeSlider = createSlider(0, 100, 50);
  volumeSlider.position(140, 20);
  volumeSlider.input(updateVolume);

  mSound = loadSound(audioPath, () => { // [3] Load the sound asynchronously with callbacks.
    mSound.connect(); // Send the loaded track to speakers; FFT analyzes the master output.
    updateVolume();

    playButton.html('Play');
    playButton.elt.disabled = false;
  }, (error) => {
    console.error(`Could not load audio: ${audioPath}`, error);
    playButton.html('Audio failed to load');
  });
}

// [2]-[6] Analyze audio and render the shader-driven orbit and particles each frame.
function draw() {
  // Dark background in HSB mode (Hue 240 = deep navy)
  background(240, 40, 10);
  orbitControl();
  lights();

  let bass = 0, treble = 0;

  if (mSound && mSound.isPlaying()) { // [3] Read FFT energy only during playback.
    fft.analyze();
    bass = fft.getEnergy(20, 250) / 255;
    treble = fft.getEnergy(2000, 12000) / 255;
  }

  // 2. Map pitch energy to dynamic HSB hues
  let bassHue = map(bass, 0, 1, 300, 360);     // Shift from Magenta to Red on bass hits
  let trebleHue = map(treble, 0, 1, 160, 240); // Shift from Cyan to Blue on treble hits

  const orbitSpeed = frameCount * 0.0028;
  const orbitRadius = min(width, height) * 0.36;

  // [1][4] Pass animation time and normalized audio levels to the shader.
  shader(visualShader);
  visualShader.setUniform('u_time', millis() / 2500 * 0.7);
  visualShader.setUniform('u_bass', bass);
  visualShader.setUniform('u_treble', treble);

  for (let i = 0; i < numShapes; i++) {
    const angle = (TWO_PI / numShapes) * i + orbitSpeed;
    const x = cos(angle) * orbitRadius;
    const y = sin(angle) * orbitRadius;

    // [5] Isolate transforms and draw each orbiting box or sphere.
    push();
    translate(x, y, 0);
    rotateZ(-angle);
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
  resetShader();

  // 3. Trigger Beat-Reactive Particles
  if (mSound && mSound.isPlaying() && bass > 0.45) {
    particles.push(new Particle(0, 0, 0, bassHue, bass));
  }

  // Update & Render Active Particle
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// [5][6] HSB particles use p5.Vector motion and fade as their lifetime decreases.
// HSB Audio-Reactive Particle Class, this was added and troubleshooted by Visual Studio, since even LLM was getting it wrong
class Particle {
  constructor(x, y, z, hueVal, intensity) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.7, 2.1) * intensity);
    this.life = 255;
    this.hue = hueVal;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 1.4;
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
// the function had to be reorginazed
// [3][7] Start audio in the user gesture, then toggle playback and button text.
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
// I added teh volume toggle, since I was not sure if it was playing or not
function updateVolume() {
  // [3][7] Apply the slider's normalized value to the SoundFile amplitude.
  if (mSound && volumeSlider) {
    mSound.amp(Number(volumeSlider.value()) / 100, 0.05);
  }
}

function windowResized() {
  // [7] Keep the canvas dimensions in sync with the browser window.
  resizeCanvas(windowWidth, windowHeight);
}