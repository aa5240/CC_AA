let sound, amp, cnv;

async function setup() {
  cnv = createCanvas(100, 100);
  cnv.mousePressed(playSound);
  textAlign(CENTER);
  fill(255);
  //replace this sound with something local with rights to distribute
  sound = await loadSound('/media/PER_FINAL.mp3');
  amp = new p5.Amplitude();
  sound.connect(amp);
}

function playSound() {
  sound.play();
}

function draw() {
  let level = amp.getLevel();
  level = map(level, 0, 0.2, 0, 255);
  background(level, 0, 0);
  text('tap to play', width/2, 20);
  describe('The color of the background changes based on the amplitude of the sound.');
}