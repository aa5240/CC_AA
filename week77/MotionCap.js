let videos = [];

// FaceMesh & Webcam Variables
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

// Audio Synthesizer & Delay Effect Variables
let osc; 
let delay;
let isAudioStarted = false;

// 1. Array of musical scale pitch frequencies in Hz (A minor pentatonic scale)
let scaleNotes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25, 587.33];

// Landmark index groups for facial features in ml5.faceMesh
const mouthIndices = new Set([13, 14, 61, 78, 82, 87, 88, 291, 308, 311, 324, 402, 415]);
const eyeIndices = new Set([
  33, 133, 160, 158, 153, 144,
  362, 263, 387, 385, 380, 373
]);
const noseIndices = new Set([1, 2, 4, 5, 6, 19, 94, 98]);

let videoNames = [
  'DSCN1718', 'DSCN1719', 'DSCN1720', 'DSCN1721', 'DSCN1723', 'DSCN1724', 'DSCN1725',
  'DSCN1726', 'DSCN1727', 'DSCN1728', 'DSCN1729', 'DSCN1730', 'DSCN1731', 'DSCN1733', 
  'DSCN1734', 'DSCN1735', 'DSCN1736', 'DSCN1737', 'DSCN1738', 'DSCN1739', 'DSCN1495'
];

// Asynchronous setup in p5.js v2 (global mode)
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize Webcam Stream
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Initialize Sound Synthesizer Oscillator & Audio Delay Effect
  osc = new p5.Oscillator(440, 'triangle');
  osc.amp(0.15);

  delay = new p5.Delay(0.25, 0.4);
  osc.disconnect();               // Route sound through delay effect pedal
  osc.connect(delay);

  // Load Videos Asynchronously (No Preload)
  for (let name of videoNames) {
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
    v.volume(0);  // Mute for browser autoplay policies
    v.loop();     // Continuously loop video feed
    v.hide();
    videos.push(v);
  }

  // Load ml5 FaceMesh Model Asynchronously
  faceMesh = await ml5.faceMesh(options);
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background(10, 10, 18);
  orbitControl();
  directionalLight(255, 255, 255, 2, 12, -10);
  ambientLight(80);
  lights();

  let spinAngle = frameCount * 0.02;

  // Render Face Mask when webcam face data and videos are ready
  if (faces.length > 0 && faces[0].keypoints && videos.length >= 4) {
    let face = faces[0];

    // Measure mouth opening distance to control scale notes and delay echoes
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let mouthDistance = 10;

    if (upperLip && lowerLip) {
      mouthDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);

      // 2. Map mouth distance to an array index and select pitch frequency
      let noteIndex = floor(map(mouthDistance, 5, 75, 0, scaleNotes.length - 1, true));
      let targetFreq = scaleNotes[noteIndex];

      if (isAudioStarted) {
        osc.freq(targetFreq, 0.05); // Play distinct scale notes from array

        // Modulate delay echo depth with mouth opening
        let feedbackVal = map(mouthDistance, 5, 75, 0.1, 0.65, true);
        delay.feedback(feedbackVal);
      }
    }

    // Render Face Mask with Regional Video Textures
    for (let j = 0; j < face.keypoints.length; j += 2) {
      let keypoint = face.keypoints[j];

      // Select distinct valid video texture based on facial region
      let activeTex = getRegionVideo(j);

      // Convert 2D camera coordinates to WEBGL centered 3D space
      let faceX = map(keypoint.x, 0, 640, -width / 2, width / 2);
      let faceY = map(keypoint.y, 0, 480, -height / 2, height / 2);
      let faceZ = keypoint.z || 0;

      push();
      translate(faceX, faceY, faceZ);

      // Scale cubes dynamically with mouth movement
      let cubeSize = map(mouthDistance, 5, 75, 16, 28, true);

      texture(activeTex);
      noStroke();
      box(cubeSize);
      pop();
    }

    drawFaceRings(face.keypoints);
  } else {
    // Fallback orbital visualizer while webcam or FaceMesh loads
    for (let i = 0; i < min(videos.length, 21); i++) {
      let angle = (TWO_PI / 12) * i + spinAngle;
      push();
      translate(cos(angle) * 350, sin(angle) * 350, 0);
      texture(videos[i]);
      noStroke();
      box(40);
      pop();
    }
  }
}

function drawFaceRings(keypoints) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let point of keypoints) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      continue;
    }

    minX = min(minX, point.x);
    maxX = max(maxX, point.x);
    minY = min(minY, point.y);
    maxY = max(maxY, point.y);
  }

  if (!Number.isFinite(minX)) {
    return;
  }

  let centerX = map((minX + maxX) / 2, 0, 640, -width / 2, width / 2);
  let centerY = map((minY + maxY) / 2, 0, 480, -height / 2, height / 2);
  let faceSize = max((maxX - minX) * width / 640, (maxY - minY) * height / 480);
  let baseRadius = faceSize * 0.65;
  let rotation = frameCount * 0.015;
  let colors = [
    [70, 220, 255],
    [255, 100, 190],
    [190, 130, 255]
  ];

  for (let i = 0; i < colors.length; i++) {
    push();
    translate(centerX, centerY, 25);
    rotateX(rotation * (i + 1));
    rotateY(rotation * (i % 2 === 0 ? 1 : -1));
    rotateZ(rotation * 0.5);
    ambientMaterial(...colors[i]);
    noStroke();
    torus(baseRadius * (0.8 + i * 0.2), max(2, baseRadius * 0.025), 48, 8);
    pop();
  }
}

// Helper function: Assigns valid video array elements to eyes, nose, mouth, and cheeks
function getRegionVideo(index) {
  if (mouthIndices.has(index)) {
    return videos[index % videos.length]; // Mouth video
  } else if (eyeIndices.has(index)) {
    return videos[20 % videos.length]; // Eyes video
  } else if (noseIndices.has(index)) {
    return videos[21 % videos.length]; // Nose video
  } else {
    return videos[28 % videos.length]; // Cheeks & face outline video
  }
}

// Click canvas to unlock Web Audio context and start sound synthesizer
function mousePressed() {
  userStartAudio();
  if (!isAudioStarted) {
    osc.start();
    isAudioStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}