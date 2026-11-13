let mSound;
let fft;

// Asynchronous asset loading in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(256);

  try {
    // Await audio loading inside async setup
    mSound = await loadSound('assets/PER_FINAL.mp3');
    mSound.connect(fft); // Connect sound to FFT analyzer
  } catch (err) {
    console.log('Sound loading error:', err);
  }
}

function draw() {
  background(20);

  let spectrum = fft ? fft.analyze() : [];
  
  // Display helpful instruction if sound isn't playing
  if (!mSound || !mSound.isPlaying()) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text('Click canvas to start audio-visual performance', width / 2, height / 2);
  }
}

// Click event unlocks browser audio context and starts sound loop
function mousePressed() {
  userStartAudio(); // Resume browser audio context
  if (mSound && !mSound.isPlaying()) {
    mSound.loop();
  }
}