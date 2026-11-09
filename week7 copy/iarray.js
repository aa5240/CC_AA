// Define global variables for video, button, and playback state
let playing = false;
let video;
let button;

async function setup() {
  // Remove canvas to let DOM elements render directly on the web page
  noCanvas();

  // Load video stream asynchronously with distinct format options
  video = createVideo(['/assets/DSCN1725.mp4', '/assets/DSCN1725.webm']);
  video.volume(0); // Mute video so browsers allow playback

  // Create an HTML button element labeled 'play'
  button = createButton('play');

  // Trigger toggleVid() whenever the button is pressed
  button.mousePressed(toggleVid);
}

function toggleVid() {
  // Pause or loop video based on current playing state
  if (playing) {
    video.pause();
    button.html('play');
  } else {
    video.loop();
    button.html('pause');
  }

  // Toggle boolean status
  playing = !playing;
}
