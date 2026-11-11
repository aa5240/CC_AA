let mSound;

async function setup() {
  createCanvas(640, 480);

  // Load sound asynchronously in p5.js v2
  mSound = await loadSound("PER_FINAL.mp3");
}

function mousePressed() {
  // Start audio context on user interaction
  userStartAudio();

  // Play audio stream
  if (mSound && mSound.isLoaded()) {
    mSound.play();
  }
}