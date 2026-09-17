// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script>
// my first p5.Polar sketch

function setup() {
  noLoop();
  createCanvas(500, 500);
}




function draw() {
  background(255, 0, 0);
  text("p5.Polar Template", 100, height / 2);
    setCenter(width/2, height/2);
    background(220);
    polarEllipses(10, 0, 0, 100,)
        fill(args[0]*40, args[0]*40, args[0]*40, 160);
        args[2] = args[0]*6;
        args[3] = args[0]*6;
        return args;     
    };

  // Insert your drawing here
  // for loop - a piece of code
  // until the condition is met
  for (let i = 0; i < 360; i += 10) {
    ellipse(i + width / 2, i + height / 2, 10, 10);
  }

  // conditionals - if, else if, else
  for (let j = 0; j < 360; j += 10) {
    if (j % 2 === 0) {
      fill(0, 0, 255);
    } else {
      fill(255, 255, 0);
    }
    ellipse(j + width / 2, j + height / 2, 10, 10);
  }


function drawing01() {
  // Drawing logic can be added here.
  strokeWeight(5);
  for (let j = 0; j < 360; j += 10) {
    // Drawing logic for the third sketch
    ellipse(j + width / 2, j + height / 2, 10, 10);
  }
}

function drawing02() {
  for (let j = 0; j < 360; j += 10) {
    if (j === 0) {
      fill(255, 0, 0);
    } else if (j < 180) {
      fill(0, 255, 0);
    } else {
      fill(0, 0, 255);
    }
    ellipse(j + width / 2, j + height / 2, 10, 10);
  }
}




