

let x = 0;
let s = 120;
let pos = 0;

function setup() {
  createCanvas(400, 400);

}

function draw() {
  background(155, 5, 10);
  text(v, width / 2, height / 2);
  // framecount
  if (x > width) {
    x = 0;
  }

  x = (frameCount % width) + (s / 2);
  // tip: print frameCount and x for more
  let sp = second();
  console.log(x);
  ellipse(x, height / 2, s);
  let offset = 200;

  let v = sin(millis() * 0.001) * 100; // Calculate the value based on time
  textSize(32);
  textAlign(CENTER, CENTER);
  text(v, width / 2, height / 2);

  let xSpeed = sin((360/period) * millis());
  let x = map(xSpeed, -1, 1, 0, amp);
  

  text("Week 5 Sketch", width / 2, height / 2);
}
function scene1() {
  background(155, 5, 10);
  ellipse(width / 2, height / 2, 100);
}

function scene2() {
  background(5, 155, 10);
  rect(width / 2, height / 2, 100, 100);
  rectmode(CENTER);
  rect(width / 2, height / 2, 100, 100);
}
