let videos = [];
// went through another body of work I was experimenting with, and added motion capture with the help of LLM to try and combine the code, due to some of the code being either out of date or LLM recommended teh source for me. 
// Creating sound through mouth movement was recommended by LLM, since I was not able to utlize my MP3, so I decided to look into synthsising sound
// Source references for the Code used throughout this sketch with updates from Visual Studio and LLM:
// [1] ml5 FaceMesh: https://docs.ml5js.org/#/reference/facemesh
// [2] p5.js map(): https://p5js.org/reference/p5/map/
// [3] p5.js transforms: https://p5js.org/reference/p5/push/, https://p5js.org/reference/p5/pop/,
//     https://p5js.org/reference/p5/translate/
// [5] p5.js canvas and webcam: https://p5js.org/reference/p5/createCanvas/,
//     https://p5js.org/reference/p5/createCapture/
// [6] p5.js video playback: https://p5js.org/reference/p5/createVideo/
// [7] p5.sound oscillator, delay, and audio start: https://github.com/processing/p5.js-sound,
//     https://github.com/processing/p5.js-sound/blob/main/src/oscillator.js
// [8] p5.js drawing and WebGL: https://p5js.org/reference/p5/draw/,
//     https://p5js.org/reference/p5/clear/,
//     https://p5js.org/reference/p5/lights/,
//     https://p5js.org/reference/p5/directionalLight/, https://p5js.org/reference/p5/ambientLight/,
//     https://p5js.org/reference/p5/texture/, https://p5js.org/reference/p5/noStroke/,
//     https://p5js.org/reference/p5/box/
// [9] p5.js math: https://p5js.org/reference/p5/dist/, https://p5js.org/reference/p5/floor/,
//      https://p5js.org/reference/p5/random/, https://p5js.org/reference/p5/millis/,
//      https://p5js.org/reference/p5/min/, https://p5js.org/reference/p5/max/
// [10] p5.js input and resize events: https://p5js.org/reference/p5/mousePressed/,
//      https://p5js.org/reference/p5/windowResized/, https://p5js.org/reference/p5/resizeCanvas/
// [11] JavaScript Set and Number.isFinite():
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set,
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
// [12] ml5 HandPose: https://docs.ml5js.org/#/reference/handpose

// FaceMesh & Webcam Variables
let faceMesh;
let handPoseModel;
let video;
let faces = [];
let hands = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: false }; // [1] FaceMesh model options.
let handPoseOptions = { maxHands: 2, flipped: false }; // [12] Track up to two hands.

// Audio Synthesizer & Delay Effect Variables
let osc; 
let delay;
let isAudioStarted = false;

// 1. Array of musical scale pitch frequencies in Hz (A minor pentatonic scale)
let scaleNotes = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25, 587.33];

// Landmark index groups for facial features in ml5.faceMesh
// [1][11] Landmark IDs select facial regions; Sets make membership checks direct.
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
let backgroundVideoIndex = -1;
let nextBackgroundSwitch = 0;
const BACKGROUND_SWITCH_INTERVAL = 5000;

// [1][5][6][7][12] Initialize webcam, video textures, audio, and both tracking models.
async function setup() {
  let sketchCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
  sketchCanvas.elt.style.position = 'fixed';
  sketchCanvas.elt.style.top = '0';
  sketchCanvas.elt.style.left = '0';
  sketchCanvas.elt.style.zIndex = '1';
  document.body.style.margin = '0';
  document.body.style.background = 'transparent';

  // [5] Capture video from the webcam and keep its element hidden.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // [7] Create an oscillator and route it through a delay effect.
  osc = new p5.Oscillator(440, 'triangle');
  osc.amp(0.15);

  delay = new p5.Delay(0.25, 0.4);
  osc.disconnect();               // Route sound through delay effect pedal
  osc.connect(delay);
  // [6] Create hidden, looping video elements to use as textures.
  for (let name of videoNames) {
    let v = createVideo(`assets/${name}.mp4`);
    v.volume(0);  // Mute for browser autoplay policies
    v.elt.muted = true;
    v.loop();     // Continuously loop video feed
    v.hide();
    videos.push(v);
  }
  setRandomBackgroundVideo();
  nextBackgroundSwitch = millis() + BACKGROUND_SWITCH_INTERVAL;

  // [1] Wait until FaceMesh is loaded before starting detection.
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;
  faceMesh.detectStart(video, gotFaces);

  // [12] Wait until HandPose is loaded before starting detection.
  handPoseModel = ml5.handPose(handPoseOptions);
  await handPoseModel.ready;
  handPoseModel.detectStart(video, gotHands);
}

function gotFaces(results) {
  // [1] Store the latest array of detected faces from the model callback.
  faces = results;
}

function gotHands(results) {
  // [12] Store the latest array of detected hands from the model callback.
  hands = results;
}

function setRandomBackgroundVideo() {
  if (videos.length === 0) {
    return;
  }

  let nextIndex = floor(random(videos.length));
  while (videos.length > 1 && nextIndex === backgroundVideoIndex) {
    nextIndex = floor(random(videos.length));
  }

  if (backgroundVideoIndex >= 0) {
    videos[backgroundVideoIndex].elt.style.display = 'none';
  }

  backgroundVideoIndex = nextIndex;
  let backgroundElement = videos[backgroundVideoIndex].elt;
  backgroundElement.style.position = 'fixed';
  backgroundElement.style.top = '0';
  backgroundElement.style.left = '0';
  backgroundElement.style.width = '100vw';
  backgroundElement.style.height = '100vh';
  backgroundElement.style.objectFit = 'cover';
  backgroundElement.style.zIndex = '0';
  backgroundElement.style.pointerEvents = 'none';
  backgroundElement.style.display = 'block';
}

// [8][9] p5.js calls draw() repeatedly; math and WebGL APIs position the visuals.
function draw() {
  clear();
  if (videos.length > 0 && millis() >= nextBackgroundSwitch) {
    setRandomBackgroundVideo();
    nextBackgroundSwitch = millis() + BACKGROUND_SWITCH_INTERVAL;
  }
  directionalLight(255, 255, 255, 2, 12, -10);
  ambientLight(80);
  lights();

  // Render Face Mask when webcam face data and videos are ready
  if (faces.length > 0 && faces[0].keypoints && videos.length >= 4) {
    let face = faces[0];

    // [1][7][9] Measure the lip landmarks and map their distance to pitch and delay.
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

    // [1][2][3][6][8] Place video-textured boxes at the detected face landmarks.
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

  }

  // [12] Draw video-textured cubes only at detected hand landmarks.
  if (videos.length > 0) {
    for (let handIndex = 0; handIndex < hands.length; handIndex++) {
      let hand = hands[handIndex];
      if (!hand.keypoints) {
        continue;
      }

      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        let handX = map(keypoint.x, 0, 640, -width / 2, width / 2);
        let handY = map(keypoint.y, 0, 480, -height / 2, height / 2);

        push();
        translate(handX, handY, keypoint.z || 0);
        texture(videos[(j + handIndex * 7) % videos.length]);
        noStroke();
        box(12);
        pop();
      }

    }
  }
}

// Helper function: Assigns valid video array elements to eyes, nose, mouth, and cheeks
function getRegionVideo(index) {
  // [11] Use landmark Set membership to choose an existing video texture.
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

// [7][10] Start audio in response to a user click, as required by browser audio policies.
function mousePressed() {
  userStartAudio();
  if (!isAudioStarted) {
    osc.start();
    isAudioStarted = true;
  }
}

function windowResized() {
  // [10] Keep the p5 canvas sized to the browser window.
  resizeCanvas(windowWidth, windowHeight);
}