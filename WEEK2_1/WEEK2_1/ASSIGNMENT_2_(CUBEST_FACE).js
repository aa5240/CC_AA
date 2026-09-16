
// This is a simple sketch that draws a red circle, a green circle, and a blue rectangle on a canvas. It also displays the text "GO GINA!" in the center of the canvas.
//date 9/9/2026
// scale, rotation, and translation.

function setup() {
  createCanvas(1200, 500);
  r = random(100,1000);
  console.log(r);
    background(60, r, 80);
}

function draw() {
  //size of shapes
let s1= 200;//size of red circle
let s2= 350;//size of green circle
// below is an array of sizes for the rectangle, but I will just use one size for now
let s3= [150,1000];//size of blue rectangle
console.log(s3);


// Draw red circles repeatedly.
  fill(255, 0, 0);
  circle(mouseX, mouseY, 40);
//Face Frame
fill(120, 0, r);
ellipse(width/2, height/2, 1000, r);

  //blue rectangle
  rectMode(CENTER);
  fill(r, 55, 255);
  rect((width/4), 100, r, s3[1]);
//blue rectangle (number 2)
  rectMode(LEFT);
  fill(55, r, 255);
  rect(width/4),r, 100, 400;
  //blue rectangle (number 3)
  rectMode(LEFT);
  fill(10, 35, 255);
  rect(width/4,r, 100, 300);;;
//blue rectangle (number 4)
  rectMode(RIGHT);
  fill(r, r, 100);
  rect(width/4*3,r, r, r);
  //blue rectangle (number 5)
  rectMode(RIGHT);
  fill(r, 0, 40);
  rect(width/4*3, 100, s3[0], s3[1]);
//blue rectangle (number 6)
  rectMode(RIGHT);
  fill(300, r, 255);
  rect(width/4*3,r, 100, 400);
  //blue rectangle (number 7)
  rectMode(RIGHT);
  fill(r, 0, 100);
  rect(width/4*3,r, 100, 300);;;
//blue rectangle (number 8)
  rectMode(RIGHT);
  fill(0, r, 150);
  rect(width/4*3,100, 30, 40);
  
  //blue rectangle (number 9)
  rectMode(RIGHT);
  fill(r, r, 100);
  rect(width/4*3,r, r, 200);
  //blue rectangle (number 10)
  rectMode(RIGHT);
  fill(r, 0, 40);
  rect(width/4*3, 100, s3[0], r);
//blue rectangle (number 11)
  rectMode(RIGHT);
  fill(300, r, 255);
  rect(width/4*3,r, 100, r);
  //blue rectangle (number 12)
  rectMode(RIGHT);
  fill(r, 0, 100);
  rect(width/4*3,r, 100, 300);;;
//blue rectangle (number 13)
  rectMode(RIGHT);
  fill(0, r, 150);
  rect(width/4*3,r, 30, 40);

 
  //Eye function (Right Eye)
 ellipse(width/4*3, height/3, r, 100);
fill(0, 0, r);
fill (r)
ellipse(width/4*3, height/3, r, 60);
 fill(50, 0, r);
 ellipse(width/4*3, height/3, r, 30);
 fill(r);
 ellipse(width/4*3, height/3, 30, 30);
 //Eyelid function (Left Eye)
 fill(200, 0, r);
 ellipse(width/4, height/3, r, 100);
 fill(r);
ellipse(width/4, height/3, r, 60);
fill(500, 0, r);
ellipse(width/4, height/3, r, 30);
fill(r);
ellipse(width/4, height/3, 30, 30); 

//Nose function
fill(0, 0, r);
rect(width/2, height/1, r, 600);
fill(r,0,100);
ellipse(width/2, height/1, r, s2);
fill(50, 0, r);
ellipse(width/2*3, height/1, r, s1);
 }

function mousePressed() {   
  r = random(30,600);
  console.log(r);
  background(r, r, 60);

}

