/* Example 

Incorporating multiple sketches

Original animations: 
Texture 1 - https://editor.p5js.org/melodyloveless/sketches/9Vbf_peML
Texture 2 - https://editor.p5js.org/melodyloveless/sketches/vP7c8h76t
*/
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;
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
 angleMode(DEGREES);
   let radius = min(width, height) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;
    }

// make sure to include a pg.push() at the top of your original animation and pg.pop() at the bottom of the animation
// having multiple pg.push() and pg.pop() in one texture is okay (and sometimes necessary!)
function melodyTexture1(pg) {

    let amplitude = width / 2;
  let xOffset = width / 4;

  let x = frameCount % amplitude;
  let y = height / 2;

  let secondAngle = map(second(), 0, 60, 0, 360);
  let minuteAngle = map(minute(), 0, 60, 0, 360);
  let hourAngle = map(hour(), 0, 12, 0, 360);

  pg.clear();
  pg.push(); 

    pg.background([255,255,255]);
    pg.noStroke();

  for (i = 0; i < second(); i++) {
    // for size
    let s = map(second(), 0, 59, 180, 20); 
         // Rotate the coordinate system a little more each frame.
  let angle = frameCount * 0.01;
  let ca = cos(angle);
  let sa = sin(angle);
  pg.applyMatrix(ca, 0, sa, 0, 0, 1, 0, 0, -sa, 0, ca, 0, 0, 0, 0, 1);
    // random colors
    pg.fill(c[i]);
    
    // switch directions when shape is at edge
    if (y[i] >= 400 || y[i] <= 0) {
      ySpeed[i] = ySpeed[i] * -1;

stroke(255);
  pg.push();
  rotate(secondAngle);
  pg.ellipse(0, 10, 1, -secondsRadius);
  pg.pop();

  // Minute hand
  pg.push();
  rotate(minuteAngle);
  pg.ellipse(0, 10, 1, -minutesRadius);
  pg.pop();

  // Hour hand
  pg.push();
  rotate(hourAngle);
  pg.ellipse(0, 10, 1, -hoursRadius);
  pg.pop();

  // Second hand (line)
  pg.push();
  rotate(secondAngle);
  pg.line(0, 10, 0, -secondsRadius);
  pg.pop();

  // Minute hand (line)
  pg.push();
  rotate(minuteAngle);
  pg.line(0, 10, 0, -minutesRadius);
  pg.pop();

  // Hour hand (line)
  pg.push();
  rotate(hourAngle);
  pg.line(0, 10, 0, -hoursRadius);
  pg.pop();
    
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