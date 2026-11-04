/* Example 

Incorporating multiple sketches

Original animations: 
Texture 1 - https://editor.p5js.org/melodyloveless/sketches/9Vbf_peML
Texture 2 - https://editor.p5js.org/melodyloveless/sketches/vP7c8h76t
*/
let pMapper;
let quad0, quad1; // two surfaces

// Texture 1 variables
let x = [];
let y = [];
let ySpeed = [];
const numCircles = 60; // max # of seconds
let c = []; // for colors

// Texture 2 variables
let pos = 0;
let myAnimation;
const b = ["#F44336", "#8BC34A", "#03A9F4"];
const f = ["#FF9800", "#FF0C94", "#F7FF96"];

async function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    quad0 = pMapper.createQuadMap(730,730); // width+height
    quad1 = pMapper.createQuadMap(200,200); // width+height

    // loads calibration in the "maps" directory
    //pMapper.load("maps/map.json");

    melodySetup1();
    melodySetup2();
}

function draw() {
    background(0);
    quad0.displaySketch(melodyTexture1);
    quad1.displaySketch(melodyTexture2);

}

function keyPressed() {
    switch (key) {
        case "c":
            pMapper.toggleCalibration();
            break;
        case "f":
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case "l":
            pMapper.load("maps/map.json");
            break;

        case "s":
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* First Texture/Sketch */

//function melodySetup1() {

// make sure to include a pg.push() at the top of your original animation and pg.pop() at the bottom of the animation
// having multiple pg.push() and pg.pop() in one texture is okay (and sometimes necessary!)
/* 1. Setup - runs ONCE at startup */
function melodySetup1() {
  // Set hand sizes relative to the graphics buffer
  // Fill color array ONCE so it doesn't grow infinitely in draw
  c = [];
  for (let i = 0; i < numCircles; i++) {
    c.push(color(random(255), random(255), random(255)));
  }
}

/* 2. Texture - runs every frame */
function melodyTexture1(pg) {

  pg.clear();
  pg.push(); 

  pg.background(255);
  pg.noStroke();

  // 1. Draw grid of background circles based on seconds
  let cols = 10;
  let spacing = pg.width / cols;

   // 1. Seconds Loop
  for (let s = 0; s < second(); s++) {
    let col = s % cols;
    let row = floor(s / cols);
    let xPos = col * spacing + spacing / 2;
    let yPos = row * spacing + spacing / 2;

    pg.fill(c[s]);
    pg.circle(xPos, yPos, 30);
  }

  // 2. Minutes Loop
  for (let m = 0; m < minute(); m++) {
    let xPos = (m * 20) % pg.width;
    let yPos = 40;
    pg.fill(0, 200, 255);
    pg.rect(xPos, yPos, 15, 15);
  }

  // 3. Hours Loop
  for (let h = 0; h < hour() % 12; h++) {
    let xPos = (h * 30) % pg.width;
    let yPos = 80;
    pg.fill(255, 100, 0);
    pg.square(xPos, yPos, 20);
  }

  // 3. Border box around buffer edge
  pg.noFill();
  pg.strokeWeight(15);
  pg.stroke(255, 255, 0);
  pg.rect(0, 0, pg.width, pg.height);

  pg.pop();
}
function melodySetup2() {
  const duration = 1000; // 1 second
  myAnimation = setInterval(fillColors, duration);
}

function melodyTexture2(pg) {
  pg.push(); 
  pg.noStroke();
  let r = 10; // rate in seconds
  let t = (millis() % (r * 1000)) / (r * 1000); // total loop time, outputs 0-1

  // bg color
  bg = paletteLerp(
    [
      [b[0], 0],
      [b[1], 0.5],
      [b[2], 1],
    ],
    t
  );
  pg.background(bg);
  // size of shape
  let s = map(t, 0, 1, 0, 300);

  // fill of shape, position controlled by fillColors()
  pg.fill(f[pos]);
  
  pg.ellipse(100, 100, s);

  pg.pop();
}

function fillColors() {
  if (pos == b.length - 1) {
    pos = 0;
  }
  pos++;
}