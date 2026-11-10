// Array to hold shape objects and videos: the work entials videos in a 3D orbiting ring with interactive controls.
// personal exploration of p5.js 3D capabilities, inspired by p5.js forums and examples, with additional features for user interaction and control.
// timecapsule project, 2026, by Ahmad and N13886660, exploring 3D video mapping and interactive controls in a web environment.
// while mainting actual video footage taken by Ahmad.
let shapeObjects = [];
let videos = [];
let selectedShape = null;

let videoNames = [
  'DSCN1718', 'DSCN1719', 'DSCN1720', 'DSCN1721', 'DSCN1723', 'DSCN1724', 'DSCN1725',
  'DSCN1726', 'DSCN1727', 'DSCN1728', 'DSCN1729', 'DSCN1730', 'DSCN1731', 'DSCN1733', 
  'DSCN1734', 'DSCN1735', 'DSCN1736', 'DSCN1737', 'DSCN1738', 'DSCN1739', 'DSCN1495', 
  'DSCN1403', 'DSCN1404', 'DSCN1405', 'DSCN1406', 'DSCN1407', 'DSCN1409', 'DSCN1410', 
  'DSCN1411', 'DSCN1412', 'DSCN1413'
];

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Load videos asynchronously using async/await (p5.js v2) LLM recommendation: Use createVideo with multiple formats for better browser compatibility
  for (let name of videoNames) { // Code found on p5.js forums: Use createVideo with multiple formats for better browser compatibility
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]); // refrain from using .mov for web compatibility, advice found on p5.js forums
    v.volume(0);  // Mute for browser autoplay policies (LLM recommendation: Mute videos to allow autoplay)
    v.loop();     // Continuously loop video (LLM recommendation: Loop videos for continuous playback)
    v.hide();
    videos.push(v);
  }
// recommended by LLM: Use Promise.all to ensure all videos are loaded before proceeding
  // Set up 3D video objects in a circular orbit arrangement
  let total = videos.length; // Total number of video cubes
  let orbitRadius = 1000; // Radius of the orbital ring 
// code found on p5.js forums: Use createVideo with multiple formats for better browser compatibility, updated by LLM
  for (let i = 0; i < total; i++) {
    let baseAngle = (TWO_PI / total) * i; // Initial angle spacing

    shapeObjects.push({
      baseAngle: baseAngle,
      orbitRadius: orbitRadius,
      y: 0,
      size: random(100, 250), // Random size for variety
      video: videos[i],
      speedY: random(0.01, 0.02),
      offsetY: random(TWO_PI),
      floatAmp: random(5, 10)
    });
  }
}

function draw() {
  background(0);

  // Enable WebGL camera orbiting, panning, and zooming, code referenced from p5.js examples and forums: Use orbitControl for interactive 3D navigation
  orbitControl();
// code for lighting and shading adapted from p5.js examples: Use directionalLight for dynamic lighting
  directionalLight(255, 255, 255, 2, 12, -10);
  ambientLight(80);
  lights();

  // Listen for continuous key presses (W, A, S/X, D) the code was adapted from p5.js forums: Use keyIsDown for continuous movement
  handleKeyMovement();
// The keys are not fully functional fully, needs work and cleaning up
  // Continuous orbital rotation speed over time
  let orbitSpeed = frameCount * 0.001;

  // Render each video cube in the orbital ring, code found in p5.js forums: Use push/pop to isolate transformations for each shape, updated by LLM
  for (let shape of shapeObjects) {
    push();

    // Calculate dynamic 3D orbital position along X and Z axes. The code was adapted from p5.js examples: Use cos/sin for circular motion and updated by LLM
    let currentAngle = shape.baseAngle + orbitSpeed;
    let currentX = cos(currentAngle) * shape.orbitRadius;
    let currentZ = sin(currentAngle) * shape.orbitRadius;

    // Gentle floating motion on Y axis, recommended by LLM: Use sin for smooth oscillation
    let currentY = shape.y + sin(frameCount * shape.speedY + shape.offsetY) * shape.floatAmp;

    translate(currentX, currentY, currentZ);

    // Rotate cube to face outward from the center
    rotateY(-currentAngle);

    // Map live video stream onto 3D cube surface
    texture(shape.video);
    noStroke();

    box(shape.size);
    pop();
  }
}
// code refrance link: https://github.com/Chelsea-Thompto-Teaching-Examples/game-movement-p5js, updated by LLM: Use keyIsDown for continuous movement
// Continuous key controls for moving shapes smoothly, code adapted from p5.js forums: Use keyIsDown for continuous movement, updated by LLM
function handleKeyMovement() {
  let moveSpeed = 5;

  if (selectedShape) {
    // Control selected shape individually, still needs work to make it more functional and user friendly
    if (keyIsDown(87)) selectedShape.y -= moveSpeed; // 'W': Up
    if (keyIsDown(83) || keyIsDown(88)) selectedShape.y += moveSpeed; // 'S' or 'X': Down
    if (keyIsDown(65)) selectedShape.orbitRadius -= moveSpeed; // 'A': Left / Shrink Orbit
    if (keyIsDown(68)) selectedShape.orbitRadius += moveSpeed; // 'D': Right / Expand Orbit
  } else {
    // Control all shapes together if none is selected, under development, needs more work to make it more functional and user friendly
    for (let shape of shapeObjects) {
      if (keyIsDown(87)) shape.y -= moveSpeed; // 'W': Up
      if (keyIsDown(83) || keyIsDown(88)) shape.y += moveSpeed; // 'S' or 'X': Down
      if (keyIsDown(65)) shape.orbitRadius -= moveSpeed; // 'A': Left
      if (keyIsDown(68)) shape.orbitRadius += moveSpeed; // 'D': Right
    }
  }
}
// function taken from projection mapping example, adapted by LLM: Use mousePressed to select shapes and mouseDragged to adjust orbit radius
// Single key press event handler (Fullscreen toggle)
function keyPressed() {
  // Press 'F' or 'f' to toggle full screen presentation mode
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
// Mouse interaction for selecting and dragging shapes, code adapted from p5.js forums: Use mousePressed and mouseDragged for interactive shape manipulation
// Select a shape when clicked
function mousePressed() {
  let cX = mouseX - width / 2;
  let cY = mouseY - height / 2;

  for (let shape of shapeObjects) {
    let d = dist(cX, cY, shape.x || 0, shape.y);
    if (d < shape.size / 2) {
      selectedShape = shape;
      break;
    }
  }
}
// these functions are the ones in the forum, but they are the most active out of all the functions.
// Drag selected shape to expand or shrink its orbit radius
function mouseDragged() {
  if (selectedShape) {
    selectedShape.orbitRadius += (mouseX - pmouseX);
    selectedShape.y += (mouseY - pmouseY);
  }
}

// Release selection
function mouseReleased() {
  selectedShape = null;
}
// code found in p5.js forums: Use mouseWheel for interactive shape resizing, updated by LLM
// Resize shape under cursor using mouse wheel / trackpad scroll
function mouseWheel(event) {
  let cX = mouseX - width / 2;
  let cY = mouseY - height / 2;

  for (let shape of shapeObjects) {
    let d = dist(cX, cY, shape.x || 0, shape.y);
    if (d < shape.size / 2) {
      shape.size -= event.delta * 0.1;
      shape.size = constrain(shape.size, 40, 500);
      return false; // Prevent browser page scrolling, recommended by LLM: Use return false to prevent default browser behavior
    }
  }
}