// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 

function setup() {
  createCanvas(500, 500);
  for (let i = 0; i < 360; i += 10) 
    ellipse(x + width/2, y + height/2, i, 10);
    ellipse(x + width/2, y + height/2, 10, i);
    ellipse(x + width/2, y + height/2, 10, i);
  }

function draw() {
  background(255,0,0);
  text("p5.Polar Template", 100, height/2);
  // Insert your drawing here
  // for loop - a piece of code
  // until the condition is met
}


