// Define global variable for video element
let video;

async function setup() {
  // Remove default drawing canvas so video element renders directly on page [4]
  noCanvas();

  // Load video asynchronously with format fallbacks [2, 5]
  video = createVideo(['assets/DSCN1726.mp4', 'assets/DSCN1726.webm']);

  // Mute volume to satisfy browser playback policies [3]
  video.volume(0);

  // Display default browser playback controls (play, pause, timeline) [1]
  video.showControls();

  describe('A video with built-in media controls.');
}