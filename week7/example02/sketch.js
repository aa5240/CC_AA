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

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    quad0 = pMapper.createQuadMap(400,400); // width+height
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

function melodySetup1() {
 for (i = 0; i < numCircles; i++) {
      x[i] = random(400);
      y[i] = random(400);
      ySpeed[i] = random(1,8);
      
      // for color
      // random number generator
      let r = random(1); 
      if (r < 0.33) {
        c[i] = [0,0,255]; // blue
      } else if (r > 0.66) {
        c[i] = [0,255,0]; // green
      } else {
        c[i] = [255,0,0]; // red
      }
      
    }
}

// make sure to include a pg.push() at the top of your original animation and pg.pop() at the bottom of the animation
// having multiple pg.push() and pg.pop() in one texture is okay (and sometimes necessary!)
function melodyTexture1(pg) {
    pg.clear();
    pg.push(); 

    pg.background([255,255,255]);
    pg.noStroke();
    pg.blendMode(EXCLUSION); 

  for (i = 0; i < second(); i++) {
    // for size
    let s = map(second(), 0, 59, 180, 20); 
        
    // random colors
    pg.fill(c[i]);
    
    // add ySpeed to y
    y[i] = y[i] + ySpeed[i];
    
    pg.ellipse(x[i], y[i], s);
    
    // switch directions when shape is at edge
    if (y[i] >= 400 || y[i] <= 0) {
      ySpeed[i] = ySpeed[i] * -1;
    } 
  }

  // border for animation
  pg.noFill();
  pg.strokeWeight(30);
  pg.stroke([255,255,0]);
  pg.rect(0,0, 400);
  
  pg.pop();
}

/* Second Texture/Sketch */

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