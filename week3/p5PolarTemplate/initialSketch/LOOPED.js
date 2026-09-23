// For your initial sketch

function setup() {
  createCanvas(500, 500);
   r = random(10,100);
  console.log(r);
}

function draw() {
  //size of shapes
let s1= 200;//size of red circle
let s2= 350;//size of green circle
// below is an array of sizes for the rectangle, but I will just use one size for now
let s3= [150,1000];//size of blue rectangle
console.log(s3);

}

function mousePressed() {   
  r = random(30,600);
  console.log(r);
  background(r, r, 255);
  ellipse(r, r, 20, 20);
 // My first nested for loop
 fill (r,255,0)
  strokeWeight(10);
  const startingX = 20;
  const startingY = 20;
  const s = 20; // size
  const space = r; // space in between center of shapes
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      ellipse(startingX + (i * space), startingY + j * space, s);
      //console.log(j);

}
  }
}


