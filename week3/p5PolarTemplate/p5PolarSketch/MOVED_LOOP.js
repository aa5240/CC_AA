// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 


function setup() {
  createCanvas(500, 500);

  }

function mousePressed() {   
  r = random(30,600);
  console.log(r);
  background(r, r, 255);
  ellipse(r, r, 20, 20);
 fill (r,255,0)
  strokeWeight(1);
  const startingX = 20;
  const startingY = 20;
  const s = 20; // size
  const space = r; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      polarEllipses(r, 40, 40, r);
      //console.log(j);
    }
  }
}
//draw the sun and animated lighting
shiftDistScale = function(_scale, distance) {
  this.scale(_scale);
  this.translate(0, r);}

function draw() { 

   setCenter(width/2, height/2);
  let n = map(mouseX, 0, width, 1,15); // number of shapes
  let r = map(mouseX, 0, width, 30, 90); // radius
 fill(r,10,0,);
  polarTriangles(n, r, 10 );
  // control of pattern
         fill(252, 100, 20);
  polarEllipses(n, r, 10);
  fill(23, 175, 17);
  polarEllipses(n, r, 2);
  fill(3, 248, 200, 12);
  polarEllipses(n, r, 16);
  polarEllipses(30, 40+sin(frameCount/10)*20, 80, 80
);


}
