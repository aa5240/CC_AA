// Define video and playing state as global variables
let video;
let playing = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // Load video asynchronously from your relative assets folder
  video = createVideo(['/assets/DSCN1726.MOV', '/assets/DSCN1726.MOV']);
  video.volume(0); // Mute to satisfy browser autoplay policies [7, 8]
  video.hide();
}

function draw() {
  describe(
    'Two videos on the canvas with instruction text, styled with a grayscale filter.'
  );
  background(240);

  // Add instructional text
  textSize(16);
  fill(0);
  text('Click the canvas to start and pause the video feed.', 20, 30);

  // Draw the first instance of the video
  image(video, 10, 50, 320, 240);

  // Add a gray filter to the existing elements on the canvas [9, 10]
  filter(GRAY);

  // Draw the second instance of the video on top
  image(video, 150, 180, 320, 240);
}

function mousePressed() {
  // Check if video is currently playing
  if (playing) {
    video.pause();
  } else {
    video.loop();
  }

  // Toggle boolean state
  playing = !playing;
}