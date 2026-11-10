// Global variables, cleaned up the code with the help of LLM.
let pMapper;
let quad0;
let secondsRadius, minutesRadius, hoursRadius, clockDiameter;
let xScale = 0.015;
let yScale = 0.02;
let isClockActive = true;
let gapSlider, offsetSlider;
let myShader;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize Projection Mapper surface
  pMapper = createProjectionMapper(this);
  quad0 = pMapper.createQuadMap(windowWidth, windowHeight);

  ahmadSetup();
}

function shaderCallback() {
  let t = millis() * 0.001;
  let sinVal = sin(t);
  let value = map(sinVal, -1, 1, 0, 1);

  let cyan = [0, 0.5, 1, 1];
  let orange = [1, 0.5, 0, 1];

  finalColor.begin();
  finalColor.set(mix(cyan, orange, value));
  finalColor.end();
}

function draw() {
  background(0);
  quad0.displaySketch(ahmadTexture);
}
// Toggle a state variable on click
// toggle the clock display on mouse press with the Help of the isClockActive variable. When the mouse is pressed, the value of isClockActive is toggled between true and false, which can be used to control whether the clock is displayed or not in the draw function. I aked the LLM for week 8.
function mousePressed() {
  // Click anywhere to toggle the clock display on/off
  isClockActive = !isClockActive;
}

function ahmadSetup() {
  angleMode(DEGREES); // Set angle mode to degrees for clock math

  // Create UI sliders once in setup
  gapSlider = createSlider(2, width / 10, width / 20);
  offsetSlider = createSlider(0, 1000, 0);

  // Build shader if custom WebGL shader helper is available
  if (typeof buildColorShader !== "undefined") {
    myShader = buildColorShader(shaderCallback);
  }

  // Calculate clock hand radii
  let radius = min(710, 700) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;
}

// Single combined texture function
function ahmadTexture(pg) {
  pg.push(); // Start main buffer state
  pg.angleMode(DEGREES);

  // 1. Clear background first
  pg.background(0);

  // --- Layer 1: Perlin Noise Dot Grid Background ---
  pg.push();
  let gap = gapSlider.value();
  let offset = offsetSlider.value();

  pg.noStroke();
  pg.fill(255);
  for (let x = gap / 2; x < pg.width; x += gap) {
    for (let y = gap / 2; y < pg.height; y += gap) {
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);
      let diameter = noiseValue * gap;
      pg.circle(x, y, diameter);
    }
  }
  pg.pop();

  // --- Layer 2: Clock Hands & Face (Toggled by Click) ---
  if (isClockActive) {
    let secondAngle = map(second(), 0, 60, 0, 360);
    let minuteAngle = map(minute(), 0, 60, 0, 360);
    let hourAngle = map(hour() % 12, 0, 12, 0, 360);

    let sRad = pg.width * 0.35;
    let mRad = pg.width * 0.25;
    let hRad = pg.width * 0.15;

    pg.push();
    pg.translate(pg.width / 2, pg.height / 2); // Center origin

    // Clock Face Circle
    pg.fill(20); 
    pg.stroke(255, 255, 0);
    pg.strokeWeight(3);
    pg.circle(0, 0, sRad * 2 + 20);

    // Hour Hand
    pg.push();
    pg.rotate(hourAngle);
    pg.stroke(255);
    pg.strokeWeight(6);
    pg.line(0, 0, 0, -hRad);
    pg.pop();

    // Minute Hand
    pg.push();
    pg.rotate(minuteAngle);
    pg.stroke(0, 255, 255);
    pg.strokeWeight(4);
    pg.line(0, 0, 0, -mRad);
    pg.pop();

    // Second Hand
    pg.push();
    pg.rotate(secondAngle);
    pg.stroke(255, 0, 0);
    pg.strokeWeight(2);
    pg.line(0, 0, 0, -sRad);
    pg.pop();

    // Perimeter Ticks
    pg.push();
    pg.stroke(255);
    pg.strokeWeight(3);
    for (let ticks = 0; ticks < 60; ticks++) {
      pg.point(0, -sRad);
      pg.rotate(6);
    }
    pg.pop();

    pg.pop(); // Restore origin back to top-left
  }

  // --- Layer 3: Interactive Border Frame ---
  let dynamicWeight = map(mouseX, 0, width, 5, 25);
  pg.noFill();
  pg.strokeWeight(dynamicWeight);
  pg.stroke(255, 255, 0);
  pg.rect(0, 0, pg.width, pg.height);

  pg.pop(); // End main buffer state
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