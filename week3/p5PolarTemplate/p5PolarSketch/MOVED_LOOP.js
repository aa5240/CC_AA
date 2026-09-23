// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 


function setup() {
  createCanvas(500, 500);
  // Insert your drawing here
  //size of shapes
let s1= 40;//size of red circle
let s2= 50;//size of green circle
// below is an array of sizes for the rectangle, but I will just use one size for now
let s3= [150,1000];//size of blue rectangle
console.log(s3);

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
         fill(252, 100, 20);
  polarEllipses(8, 10, 10);
  fill(23, 175, 17);
  polarEllipses(12, 40, 280, 2);
  fill(3, 248, 200, 12);
  polarEllipses(10, 80, 80, 160);
  polarEllipses(30, 40+sin(frameCount/10)*20, 80, 80
);

}
