// Declare variables for shape radii  
// Octotber 4th, 2026 Clock sketch, For this sketch, I used the p5.js library to create a clock with animated hands and a dynamic background. The clock hands are represented by ellipses that rotate based on the current time, and the background color transitions through a gradient over time. The code also includes a shader for color blending and randomization for additional visual effects.
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;
let xScale = 0.015;
let yScale = 0.02;

let gapSlider;
let gap;
let offsetSlider;
let offset;
  let words = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let wordCount = 50;
let hue;
let position;


function setup() {
  createCanvas(710, 700, WEBGL);
  stroke(255);
  angleMode(DEGREES);
    describe(
    'A random series of words related to p5.js scattered onto the canvas.'
  );
 textFont('Space Mono');
   // Set the text alignment to center and set the color mode to HSB.
  textAlign(CENTER);

   // Draw as many words as set with the words variable in the
  // canvas in random positions.
  for (let i = 0; i < 20; i++) 
    textSize(random(16, 48));
    text(random(words), random(width), random(height));

  // Define the random starting point for selecting the words in the
  // array.
  position = floor(random(0, words.length - wordCount));

   // Set up the sliders
  gapSlider = createSlider(2, width / 10, width / 20);
  gapSlider.changed(dotGrid);
  gapSlider.mouseMoved(checkChanged);
  offsetSlider = createSlider(0, 1000, 0);
  offsetSlider.mouseMoved(checkChanged);

  // Draw the grid
  dotGrid();
  
  myShader = buildColorShader(shaderCallback);

  // Set radius for each shape based on canvas dimensions
  let radius = min(width, height) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;
// Based off of the clock example from https://p5js.org/examples/form-clock.html
}
function shaderCallback() {
  // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
  let t = millis() * 0.001;

  // sin(t) goes between -1 and 1 over time.
  let sinVal = sin(t);

  // map() remaps this from the range [-1, 1] to the range [0, 1].
  let value = map(sinVal, -1, 1, 0, 1);

  // Each color is [R, G, B, A] with values from 0 to 1.
  let cyan = [0, 0.5, 1, 1];
  let orange = [1, 0.5, 0, 1];

  finalColor.begin();

  // mix() blends between cyan (when value = 0) and orange (when value = 1).
  finalColor.set(mix(cyan, orange, value));

  finalColor.end();
}

// Based  off of the shader example from https://p5js.org/examples/3d-shader.html

function setPositionAndColor() {
  // Set the position to a random value (within the canvas)
  circleX = random(0, width);
  circleY = random(0, height);

  // Set R, G, and B to random values in the range (100, 256)
  circleColor = color(random(100, 256), random(100, 256), random(100, 256));
}

function checkChanged() {
  if (gap !== gapSlider.value()) {
    dotGrid();
  }
  if (offset !== offsetSlider.value()) {
    dotGrid();
  }
} 
function dotGrid() {
  noStroke();
  fill(0);
 // Get the current gap and offset values from the sliders
  gap = gapSlider.value();
  offset = offsetSlider.value();

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

      // Since noiseValue will be 0-1, multiply it by gap to set diameter to
      // between 0 and the size of the gap between circles
      let diameter = noiseValue * gap;
      circle(x, y, diameter);
    }
  }
}

function draw() {
  // The background goes from white to red to green to blue fill
   // Setting some movements through the amplitude and offset of the clock hands, I used the frameCount variable to create a dynamic effect that changes over time. The amplitude and offset values are calculated based on the width of the canvas, allowing for a responsive design that adapts to different screen sizes.
  let amplitude = width / 2;
  let xOffset = width / 4;

  let x = frameCount % amplitude;
  let y = height / 2;

    // Enable orbiting with the mouse. to conrol the camera view, I used the orbitControl() function from p5.js, which allows users to click and drag to rotate the view of the clock. This adds an interactive element to the sketch, making it more engaging for users.
  orbitControl();
    pointLight(255, 255, 255, 30, -40, 30);

  // Rotate the coordinate system a little more each frame.
  let angle = frameCount * 0.01;
  let ca = cos(angle);
  let sa = sin(angle);
  applyMatrix(ca, 0, sa, 0, 0, 1, 0, 0, -sa, 0, ca, 0, 0, 0, 0, 1);

// to set random logs for shade transition and setting stroke thickness for the clockhands
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
  ellipse(0, y, x, -secondsRadius);
  pop();

  // Minute hand
  push();
  rotate(minuteAngle);
  ellipse(0, y, x, -minutesRadius);
  pop();

  // Hour hand
  push();
  rotate(hourAngle);
  ellipse(0, y, x, -hoursRadius);
  pop();

  // Second hand (line)
  push();
  rotate(secondAngle);
  line(0, y, 0, -secondsRadius);
  pop();

  // Minute hand (line)
  push();
  rotate(minuteAngle);
  line(0, y, 0, -minutesRadius);
  pop();

  // Hour hand (line)
  push();
  rotate(hourAngle);
  line(0, y, 0, -hoursRadius);
  pop();

  // Tick markers around perimeter of clock
  push();
  for (let ticks = r; ticks < 600; ticks += 1) {
    point(r, secondsRadius);
    rotate(r);
    
  }
  pop();
 
};