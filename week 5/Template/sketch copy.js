// Declare variables for shape radii
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;

function setup() {
  createCanvas(710, 400, WEBGL);
  stroke(255);
  angleMode(DEGREES);
  myShader = buildColorShader(shaderCallback);

  // Set radius for each shape based on canvas dimensions
  let radius = min(width, height) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;

  describe('Functioning pink clock on a grey background.');
  
}
function shaderCallback() {
  // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
  let t = millis() * 0.001;

  // sin(t) goes between -1 and 1 over time.
  let sinVal = sin(t);

  // map() remaps this from the range [-1, 1] to the range [0, 1].
  let value = map(sinVal, -1, 1, 0, 1);

  // Each color is [R, G, B, A] with values from 0 to 1.
  let red = [255, 0, 0, 0.25];
  let orange = [0, 0, 139, 1];
  let green = [0, 255, 0, 0.25];
  // Found on https://html-color.codes/blue#google_vignette

  finalColor.begin();

  // mix() blends between cyan (when value = 0) and orange (when value = 1).
  finalColor.set(mix(red, green, blue));

  finalColor.end();
}


function setPositionAndColor() {
  // Set the position to a random value (within the canvas)
  circleX = random(0, width);
  circleY = random(0, height);

  // Set R, G, and B to random values in the range (10, 360)(for a more vibrant color)
  circleColor = color(random(10, 360), random(10, 360), random(10, 360));
}

function draw() {
  // The background goes from white to red to green to blue fill
  background(paletteLerp([
    ['white', 0],
    ['red', 0.05],
    ['green', 0.25],
    ['blue', 1]
  ], millis() / 10000 % 1));
   
  let amplitude = width / 2;
  let xOffset = width / 4;

  let period = periodSec * getTargetFrameRate();

  let floorTerm = floor(frameCount / period + 1);
  let absTerm = abs(frameCount / period - floorTerm);

  let x = 2 * absTerm * amplitude;
  let y = height / 2;

    r = random(0,360);
  console.log(r);
  // Move origin to center of canvas
  // Draw the clock background
  noStroke();
  
  // Calculate angle for each hand
  let secondAngle = map(second(), 0, 60, 0, 360);
  let minuteAngle = map(minute(), 0, 60, 0, 360);
  let hourAngle = map(hour(), 0, 12, 0, 360);

  stroke(255);
 shader(myShader);
  // Second hand
  
  push();
  rotate(secondAngle);
  ellipse(0, x, r, -secondsRadius);
  pop();

  // Minute hand
  
  push();
  rotate(minuteAngle);
  ellipse(0, x, r, -minutesRadius);
  pop();

  // Hour hand
  
  push();
  rotate(hourAngle);
  ellipse(0, x, r, -hoursRadius);
  pop();

  // Tick markers around perimeter of clock
  push();
  for (let ticks = r; ticks < 600; ticks += 1) {
    point(r, secondsRadius);
    rotate(r);

  }
  pop();
}
