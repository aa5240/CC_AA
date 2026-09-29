
// Plotter Template #2 (includes p5.Polar and p5.plotSvg)

// Press "s" to export drawing as SVG

p5.disableFriendlyErrors = true; // keep warnings quiet
let bDoExportSvg = false;

// This canvas dimensions are 8.5"x11" at 70 dpi
const DPI = 70; // dots per inch 
const PAGE_W = 8.5 * DPI;
const PAGE_H = 11 * DPI;


function setup() {
  createCanvas(PAGE_W, PAGE_H);
  noFill();
  setSvgGroupByStrokeColor(true); 
}

function draw() {
  background(255);
  if (bDoExportSvg) {
    beginRecordSvg("output.svg");
  }
  
  myDrawing();

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}
////////////////////////////////////////

function myDrawing() {
  // insert your drawing here
  strokeWeight(1); 
  let s = random(50,200);
setCenter(width/2, height/2);
polarTriangles(3, 500, 10 );
  // control of pattern
 polarEllipses(20, 500, 90);
 polarEllipses(20, 200, 40);
 polarEllipses(30, 100, 20);
}


function keyPressed() {
  if (key == "s") {
    bDoExportSvg = true;
  }
}
