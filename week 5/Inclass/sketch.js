

let x = 0;
let s = 120;
let pos = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  let x1 = 100;
let x2 = 300;
let x = lerp(x1,x2,0);
ellipse(x, height/2, 100);
}
