
// Plotter Template #2 (includes p5.Polar and p5.plotSvg)

p5.disableFriendlyErrors = true;
let bDoExportSvg = false;

const DPI = 70; 
const PAGE_W = 8.5 * DPI;
const PAGE_H = 11 * DPI;
let myRandomSeed = 12345; 
let regenerateButton, exportSvgButton; 
// Set the SVG to be exported when the "Export SVG" button is pressed, refrance from https://editor.p5js.org/ahmadalibaloch/sketches/0k1g3J8e
function setup() {
  createCanvas(PAGE_W, PAGE_H);
  noFill();
  setSvgGroupByStrokeColor(true); 
  UI(); // Create buttons on setup
}
// The draw function is called repeatedly in a loop, allowing for dynamic and interactive sketches. In this case, it handles the rendering of the sketch and manages the SVG export process.
function draw() {
  background(255);
  randomSeed(myRandomSeed); // Holds random values steady
  
  if (bDoExportSvg) {
    beginRecordSvg("output.svg");
  }
  // Call the function that contains the drawing logic, which can be customized to create different visual patterns and effects. This function is where the main artistic elements of the sketch are defined.
  myDrawing();

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}
// I had to regenerate the sketch's random seed to create a new version of the sketch. This allows for different iterations of the visual output. It glitched out after the last visual studio update, so I had to change the randomSeed() function to random() to fix the glitch. I will continue to experiment with this in future sketches.
function myDrawing() {
  strokeWeight(1); 
  let r = random(30, 200);
  let s = random(50, 400);
// Set the center of the polar coordinate system to the center of the canvas, allowing for symmetrical and centered patterns to be drawn. This is important for creating visually balanced designs that radiate from the center point.
  setCenter(width / 2, height / 2);
  polarTriangles(s, r, 10);
  polarEllipses(20, 40, r);
  polarEllipses(20, 100, s);
  polarEllipses(10, s, r);
// The following code creates a grid of ellipses on the canvas, with defined spacing between each ellipse. This adds a structured and organized visual element to the sketch, complementing the more dynamic polar patterns.
  const startingX = 20;
  const startingY = 20;
  let space = 50; // Defined spacing variable
// Loop through a 5x5 grid to draw ellipses at calculated positions based on the starting coordinates and spacing. This creates a uniform grid of shapes that can be visually appealing and adds complexity to the overall design.
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      ellipse(startingX + (i * space), startingY + (j * space), s); 
    }
  }
}
// The UI function was refrance from https://editor.p5js.org/ahmadalibaloch/sketches/0k1g3J8e. It creates buttons for user interaction, allowing the user to regenerate the sketch with a new random seed or export the current sketch as an SVG file. This enhances the interactivity and usability of the sketch, providing control over its output.
function UI() {
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(0, height);
  regenerateButton.mousePressed(regenerate);
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(120, height);
  exportSvgButton.mousePressed(initiateSvgExport);
}
// the randomSeed() function was changed to random() to fix the glitch that occurred after the last visual studio update. This change allows for the generation of new random values for the sketch, enabling different iterations and variations of the visual output. The regenerate function updates the random seed, ensuring that each time it is called, a new version of the sketch is created.
function regenerate() {
  myRandomSeed = random(100000);
}

function initiateSvgExport() {
  bDoExportSvg = true;
}

function keyPressed() {
  if (key === "s") {
    bDoExportSvg = true;
  }
}
