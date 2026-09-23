// For your initial sketch

function setup() {
  createCanvas(500, 500);
   r = random(10,100);
  console.log(r);
    background(60, r, 80);
}
  
function draw() {
  drawing01(); // for loop
  //drawing02(); // nested for loop
  //drawing03(); // alternating pattern w/%
  //drawing04(); // starting to iterate, shifting color and size over x-axis
  //drawing05(); // iteration + transformations

  noLoop(); 
}

// My first for loop
function drawing01() {
  background(255,0,0);
  strokeWeight(5);
  // draw a row of circles
  // ellipse(100, height/2, 50);
  // ellipse(150, height/2, 50);
  // ellipse(200, height/2, 50);
  // ellipse(250, height/2, 50);
  // ellipse(300, height/2, 50);

  // for loop - a piece of code that repeats
  // until a condition is met
  const startingX = 100;
  const s = 50; // size
  const space = 80; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    ellipse(startingX + (i * space), height / 2, s);
    console.log(startingX + (i * space));
  }
} 

// My first nested for loop
function drawing02() {
  background(255,0,0);
  strokeWeight(5);
  const startingX = 100;
  const startingY = 100;
  const s = 50; // size
  const space = 80; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      ellipse(startingX + (i * space), startingY + j * space, s);
      //console.log(j);
    }
  }
}

/* Using conditionals to change color
Features % modulo (another comparison operator)      
modulo finds the remainder left over after dividing one number by another
*/
function drawing03() {
  background(0,0,255);
  strokeWeight(5);
  const startingX = 100;
  const startingY = 100;
  const s = 50; // size
  const space = 80; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      //console.log(i % 2);
      const condition1 = i % 2 == 0 && j % 2 == 0;
      const condition2 = i % 2 == 1 && j % 2 == 1;
      if (condition1 || condition2) {
        fill(255, 255, 0); //yellow
      } else {
        fill(255); // white
      }
      ellipse(startingX + (i * space), startingY + (j * space), s);

      // Bonus: added text
      textAlign(CENTER, CENTER);
      textSize(15);
      fill(0, 0, 255);
      text(i + " " + j, startingX + i * space, startingY + j * space);
    }
  }
}

// Iterative patterns
function drawing04() {
  background(0);
  noFill();
  strokeWeight(5);
  const startingX = 90; 
  const startingY = 105;
  const s = 50; // size
  const space = 80; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      stroke(255, (i + 1) * 50, 255, (j + 1) * 50);
      ellipse(startingX + (i*space), startingY + (j*space), s+(i*20));
    }
  }
}

// Iterative patterns
// + incorporating transformations (translate, rotate, scale)
// changed to square to better show rotation
function drawing05() {
  background(0);
  noFill();
  rectMode(CENTER);
  angleMode(DEGREES);
  strokeWeight(5);
  
  const numShapes = 5;
  const startingX = 90; 
  const startingY = 105;
  const s = 50; // size
  const space = 80; // space in between center of shapes
  
  for (i = 0; i < numShapes; i++) {
    for (j = 0; j < numShapes; j++) {
      stroke((i + 1) * 50, 255, (j + 1) * 50, 255); 
      push();
      translate(startingX + (i * space), startingY + (j * space)); // rotation is from center of squares
      rotate(((i+1)*30)+(j*40)); // incorporating i and j into rotation
      scale((1/(j+1)) + 0.5); // getting smaller across the y-axis
      rect(0,0,s);
      pop();
    }
  }
}
// Idea for variations:
// Try experimenting with more transformations, layering additional changes
// Incorporate more shapes ... try adding conditionals to further patternize your work
 
