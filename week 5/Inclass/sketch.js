

let x = 0;
let s = 120;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week5-sketch'); // do not delete - links to your index.html pages (description)
  for(i= 0; i<numShapes; i++) {}
}

function draw() {
  background(155, 5, 10);
text(i)
  // framecount
  if (x > width) {
    x = 0;
  }

  x = (frameCount % width) + (s / 2);
  // tip: print frameCount and x for more
  let sp = second();
  console.log(x);
  ellipse(x, height / 2, s);

  text("Week 5 Sketch", width / 2, height / 2);
}

