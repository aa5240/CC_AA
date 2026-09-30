
// Plotter drawing 9/30/2026 (includes p5.Polar and p5.plotSvg)

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

function mousePressed() {   
  r = random(30,400);
  console.log(r);
  // insert your drawing here
  strokeWeight(1); 
  let s = random(50,400);
setCenter(width/2, height/2);
polarTriangles(s, r, 10 );
  // control of pattern
 polarEllipses(20, s, s);
 polarEllipses(20, s, r);
 polarEllipses(s, s, r);
  const startingX = 20;
  const startingY = 20;
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      ellipse(startingX + (i * space), startingY + j * space, s);
      //console.log(j);
    }}
}


function keyPressed() {
  if (key == "s") {
    bDoExportSvg = true;
  }
}
