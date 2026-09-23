// For your initial sketch

function setup() {
  createCanvas(500, 500);
    r = random(10,100);
  console.log(r);
  
}

function draw() {
  background(r,100,0);
   fill(255, 0, 0);
  circle(mouseX, mouseY, 40);
  // Insert your drawing here
  // Drawing logic can be added here.
  strokeWeight(10);
    const startingX = 50
     const startingY = 50;
    const s = r;
     const space = 20;
   for (let j = 0; j < 360; j += 10) 
    ellipse(startingX + (j * space), height / 10, s);

    ellipse(startingX + (i * space), startingY + j * space, s);
    // First nested loop
}
 
