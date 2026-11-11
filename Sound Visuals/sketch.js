let sound, amp, cnv;

let mSound;

async function setup() {
  createCanvas(640, 480);
  mSound = await loadSound("PER_FINAL.mp3");
}

function mousePressed() {
  mSound.play();
}