// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 


function setup() {
  createCanvas(500, 500);

  }

function draw() {   
  r = random(30,600);
  console.log(10);
  background(0, 0, 255);
  ellipse(50, 100, 20, 20);
 fill (0,255,0)
  strokeWeight(1);
  const startingX = 20;
  const startingY = 20;
  const s = 20; // size
  const space = r; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      polarEllipses(100, 40, 40, 40);
      //console.log(j);
    }
  }
}

function draw() { 
setCenter(width/2, height/2);
 nofill();
  polarTriangles(30, 50, 10 );
  // control of pattern
         Nofill();
  polarEllipses(200, 50, 10);
  fill(23, 175, 17);
  polarEllipses(10, 10, 2);
  fill(3, 248, 200, 12);
  polarEllipses(100, 10, 16);



}
