

p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 
// if using randomness, experiment w/ myRandomSeed to see different versions (or iterations) of your sketch
let myRandomSeed = 12345; 
let regenerateButton, exportSvgButton; 

// canvas size
const DPI = 70; // dots per inch
const PAGE_W = 8.5*DPI; 
const PAGE_H = 11*DPI;
function setup() {
  createCanvas(PAGE_W, PAGE_H);
  UI();
  noFill();
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
}
function draw(){
  clear();
  randomSeed(myRandomSeed); 
  background(255); 
  
  if (bDoExportSvg == true){
    beginRecordSvg(this, "myOutput_" + month() + day() + year() + "_" + myRandomSeed + ".svg");
  }
// code found in p5.js forums: Use push/pop to isolate transformations for each shape, updated by LLM
  // define your drawing below
  myDrawing(); 

  if (bDoExportSvg){
    endRecordSvg(); 
    bDoExportSvg = false;
  }
}// had to refer to LLM for help with the code, because it was not functional after the last visual studio code update
// I took the same functions from before and switched out the vaules in order for the drawings to appear seamlessly
function draw() { 
  strokeWeight(1); 
  let s = random(50,200);
setCenter(width/2, height/2);
polarTriangles(30, 50, 10 );
  // control of pattern
 polarEllipses(200, 50, 10);
 polarEllipses(10, 10, 2);
 polarEllipses(100, 10, 16);

function regenerate(){
  myRandomSeed = round(millis()); 
}
// had to clean up the code, because nothing was functional after the last visual studio code update
// Set the SVG to be exported when the "Export SVG" button is pressed
function initiateSvgExport(){
  bDoExportSvg = true; 
}
// code found in p5.js forums: Use createButton for UI controls, updated by LLM for the new p5.js v2 syntax
// updated all of my codes to fit into the new p5.js v2 syntax, because the old syntax was not functional after the last visual studio code update
function UI() {
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(0, height);
  regenerateButton.mousePressed(regenerate); // run regenerate() when pressed
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(120, height);
  exportSvgButton.mousePressed(initiateSvgExport); // run initiateSvgExport() when pressed
}
}
// hopfully it is easier to see and regenerate now