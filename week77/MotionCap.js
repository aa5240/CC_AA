let videos = [];
// went through another body of work I was experimenting with, and added motion capture with the help of LLM to try and combine the code, due to some of the code being either out of date or LLM recommended teh source for me. 
// Creating sound through mouth movement was recommended by LLM, since I was not able to utlize my MP3, so I decided to look into synthsising sound
// Source references for the Code used throughout this sketch with updates from Visual Studio and LLM:
// [1] ml5 FaceMesh: https://docs.ml5js.org/#/reference/facemesh
// [2] p5.js map(): https://p5js.org/reference/p5/map/
// [3] p5.js transforms: https://p5js.org/reference/p5/push/, https://p5js.org/reference/p5/pop/,
//     https://p5js.org/reference/p5/translate/, https://p5js.org/reference/p5/rotateX/,
//     https://p5js.org/reference/p5/rotateY/, https://p5js.org/reference/p5/rotateZ/
// [4] p5.js ambientMaterial(): https://p5js.org/reference/p5/ambientMaterial/
// [5] p5.js torus(): https://p5js.org/reference/p5/torus/
// [6] p5.js canvas and webcam: https://p5js.org/reference/p5/createCanvas/,
//     https://p5js.org/reference/p5/createCapture/
// [7] p5.js video playback: https://p5js.org/reference/p5/createVideo/
// [8] p5.sound oscillator, delay, and audio start: https://github.com/processing/p5.js-sound,
//     https://github.com/processing/p5.js-sound/blob/main/src/oscillator.js
// [9] p5.js drawing and WebGL: https://p5js.org/reference/p5/draw/,
//     https://p5js.org/reference/p5/orbitControl/, https://p5js.org/reference/p5/lights/,
//     https://p5js.org/reference/p5/directionalLight/, https://p5js.org/reference/p5/ambientLight/,
//     https://p5js.org/reference/p5/texture/, https://p5js.org/reference/p5/noStroke/,
//     https://p5js.org/reference/p5/box/
// [10] p5.js math: https://p5js.org/reference/p5/dist/, https://p5js.org/reference/p5/floor/,
//      https://p5js.org/reference/p5/cos/, https://p5js.org/reference/p5/sin/,
//      https://p5js.org/reference/p5/min/, https://p5js.org/reference/p5/max/
// [11] p5.js input and resize events: https://p5js.org/reference/p5/mousePressed/,
//      https://p5js.org/reference/p5/windowResized/, https://p5js.org/reference/p5/resizeCanvas/
// [12] JavaScript Set and Number.isFinite():
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set,
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite

// FaceMesh & Webcam Variables
let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: false }; // [1] FaceMesh model options.

// Audio Synthesizer & Delay Effect Variables
let osc; 
let delay;
let isAudioStarted = false;

// 1. Array of musical scale pitch frequencies in Hz (A minor pentatonic scale)
let scaleNotes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25, 587.33];

// Landmark index groups for facial features in ml5.faceMesh
// [1][12] Landmark IDs select facial regions; Sets make membership checks direct.
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

// [1][6][7][8] Initialize webcam, video textures, audio, and the FaceMesh model.
async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // [6] Capture video from the webcam and keep its element hidden.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // [8] Create an oscillator and route it through a delay effect.
  osc = new p5.Oscillator(440, 'triangle');
  osc.amp(0.15);

  delay = new p5.Delay(0.25, 0.4);
  osc.disconnect();               // Route sound through delay effect pedal
  osc.connect(delay);

  // [7] Create hidden, looping video elements to use as textures.
  for (let name of videoNames) {
    let v = createVideo([`assets/${name}.mp4`, `assets/${name}.webm`]);
    v.volume(0);  // Mute for browser autoplay policies
    v.loop();     // Continuously loop video feed
    v.hide();
    videos.push(v);
  }

  // [1] Start FaceMesh detection and send results to gotFaces().
  faceMesh = await ml5.faceMesh(options);
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  // [1] Store the latest array of detected faces from the model callback.
  faces = results;
}

// [9][10] p5.js calls draw() repeatedly; math and WebGL APIs position the visuals.
function draw() {
  orbitControl();
  directionalLight(255, 255, 255, 2, 12, -10);
  ambientLight(80);
  lights();

  let spinAngle = frameCount * 0.02;

  // Render Face Mask when webcam face data and videos are ready
  if (faces.length > 0 && faces[0].keypoints && videos.length >= 4) {
    let face = faces[0];

    // [1][8][10] Measure the lip landmarks and map their distance to pitch and delay.
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

    // [1][2][3][7][9] Place video-textured boxes at the detected face landmarks.
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
    // [3][7][9][10] Show orbiting video-textured boxes until a face is detected.
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
// Added rings around teh face, because not all of the videos are playing  and I wanted to see how they looked.
// [1]-[5] Draw three animated rings around the FaceMesh landmark bounds.
function drawFaceRings(keypoints) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
// LLM helped in the process of creating this code, while my refrence starting point for the code is: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
  // [1] FaceMesh supplies landmark coordinates used to find the face bounds.
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
// added for each of the rings rovolving around
  // [2] Convert camera coordinates to the centered p5.js canvas coordinates.
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
// created for the center of rotation
  for (let i = 0; i < colors.length; i++) {
    // [3] Isolate and animate each ring's 3D transform.
    push();
    translate(centerX, centerY, 25);
    rotateX(rotation * (i + 1));
    rotateY(rotation * (i % 2 === 0 ? 1 : -1));
    rotateZ(rotation * 0.5);
    // [4] Set the ring's material color.
    ambientMaterial(...colors[i]);
    noStroke();
    // [5] Draw a torus using its major radius, tube radius, and mesh detail.
    torus(baseRadius * (0.8 + i * 0.2), max(2, baseRadius * 0.025), 48, 8);
    pop();
  }
}

// Helper function: Assigns valid video array elements to eyes, nose, mouth, and cheeks
function getRegionVideo(index) {
  // [12] Use landmark Set membership to choose an existing video texture.
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

// [8][11] Start audio in response to a user click, as required by browser audio policies.
function mousePressed() {
  userStartAudio();
  if (!isAudioStarted) {
    osc.start();
    isAudioStarted = true;
  }
}

function windowResized() {
  // [11] Keep the p5 canvas sized to the browser window.
  resizeCanvas(windowWidth, windowHeight);
}