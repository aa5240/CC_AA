// Array to hold shape objects and videos
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

  // Load videos asynchronously using async/await (p5.js v2)
  for (let name of videoNames) {
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
    v.volume(0);  // Mute for browser autoplay policies
    v.loop();     // Continuously loop video
    v.hide();
    videos.push(v);
  }

  // Set up 3D video objects in a circular orbit arrangement
  let total = videos.length;
  let orbitRadius = 1000; // Radius of the orbital ring

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

  // Enable WebGL camera orbiting, panning, and zooming
  orbitControl();

  lights();

  // Listen for continuous key presses (W, A, S/X, D)
  handleKeyMovement();

  // Continuous orbital rotation speed over time
  let orbitSpeed = frameCount * 0.001;

  // Render each video cube in the orbital ring
  for (let shape of shapeObjects) {
    push();

    // Calculate dynamic 3D orbital position along X and Z axes
    let currentAngle = shape.baseAngle + orbitSpeed;
    let currentX = cos(currentAngle) * shape.orbitRadius;
    let currentZ = sin(currentAngle) * shape.orbitRadius;

    // Gentle floating motion on Y axis
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

// Continuous key controls for moving shapes smoothly
function handleKeyMovement() {
  let moveSpeed = 5;

  if (selectedShape) {
    // Control selected shape individually
    if (keyIsDown(87)) selectedShape.y -= moveSpeed; // 'W': Up
    if (keyIsDown(83) || keyIsDown(88)) selectedShape.y += moveSpeed; // 'S' or 'X': Down
    if (keyIsDown(65)) selectedShape.orbitRadius -= moveSpeed; // 'A': Left / Shrink Orbit
    if (keyIsDown(68)) selectedShape.orbitRadius += moveSpeed; // 'D': Right / Expand Orbit
  } else {
    // Control all shapes together if none is selected
    for (let shape of shapeObjects) {
      if (keyIsDown(87)) shape.y -= moveSpeed; // 'W': Up
      if (keyIsDown(83) || keyIsDown(88)) shape.y += moveSpeed; // 'S' or 'X': Down
      if (keyIsDown(65)) shape.orbitRadius -= moveSpeed; // 'A': Left
      if (keyIsDown(68)) shape.orbitRadius += moveSpeed; // 'D': Right
    }
  }
}

// Single key press event handler (Fullscreen toggle)
function keyPressed() {
  // Press 'F' or 'f' to toggle full screen presentation mode
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

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

// Resize shape under cursor using mouse wheel / trackpad scroll
function mouseWheel(event) {
  let cX = mouseX - width / 2;
  let cY = mouseY - height / 2;

  for (let shape of shapeObjects) {
    let d = dist(cX, cY, shape.x || 0, shape.y);
    if (d < shape.size / 2) {
      shape.size -= event.delta * 0.1;
      shape.size = constrain(shape.size, 40, 500);
      return false; // Prevent browser page scrolling
    }
  }
}