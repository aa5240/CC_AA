let shapes = []; // Array to hold shape objects
// the project goes after the whole window and screen for a more immersive experience, with the shapes orbiting around the center of the screen. 
// The user can interact with the shapes by clicking to add new ones, and they will continuously rotate for a dynamic visual effect.

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Start with one initial centered torus
  shapes.push({
    x: 0,
    y: 0,
    z: 0,
    type: 'torus'
  });
// Finally was able to set up the shader to 3D objects.
  describe('3D shapes multiply and randomize across space on click.');
   myShader = buildColorShader(shaderCallback);

  // Set radius for each shape based on canvas dimensions
  let radius = min(windowWidth, windowHeight) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;
// Based off of the clock example from https://p5js.org/examples/form-clock.html

}
// Based  off of the shader example from https://p5js.org/examples/3d-shader.html, adapting to a new set of colors soon.
// they keep glitching everytime I try to add a new color, so I will keep it simple for now. I will try to add more colors later.
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
// Trying to create a dynamic array of 3D shapes, creating an orbit of shapes that can be rotated and viewed from different angles. The shapes are randomly generated and can be added to the scene by clicking the mouse. The user can orbit around the shapes using mouse controls, and the shapes will continuously rotate for a dynamic visual effect.
function draw() {
  // adding my shader without a background to create a dynamic effect of the shapes blending with the background.
  shader(myShader);

  // Enable mouse orbiting in WebGL
  orbitControl();

  // Lighting & continuous rotation
  lights();
  rotateY(frameCount * 0.01);

  // Render each shape from our array
  for (let pos of shapes) {
    push();
    translate(pos.x, pos.y, pos.z);

    fill(255);
    stroke(0);

    // Draw the specific shape type stored in the object
    // discussing how their elements can populate randomly in space, creating a dynamic and interactive 3D scene. The shapes can be rotated and viewed from different angles, and the user can add new shapes by clicking the mouse. The shapes will continuously rotate for a dynamic visual effect.
    if (pos.type === 'torus') {
      torus(30, 15, 10, 8);
    } else if (pos.type === 'box') {
      box(40);
    } else if (pos.type === 'sphere') {
      sphere(30);
    } else if (pos.type === 'cone') {
      cone(30, 50);
    }

    pop();
  }
}
// code link is https://p5js.org/reference/p5/loadShader/, updated by LLM: Use shader() for dynamic color effects
// Add a new position and random shape type on click, updated by LLM: Use mousePressed for interactive shape addition
function mousePressed() {
  let shapeTypes = ['torus', 'box', 'sphere', 'cone'];

  shapes.push({
    x: random(-windowWidth/2, windowWidth/2),
    y: random(-windowHeight/2, windowHeight/2),
    z: random(-windowHeight/2, windowHeight/2),
    type: random(shapeTypes) // Pick a random shape from array, code found in p5.js forums: Use random() for random selection, updated by LLM
  });
}