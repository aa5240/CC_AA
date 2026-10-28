









let pos = [];

function setup() {
  createCanvas(710, 700)
}

function draw() {
    background(255,0,0);
    
 for (i=0; i<pos.length; i++) {
    elilipse(pos[i] [0].pos[i] [1], 50);
 }
 console.log(pos);

}

function mousePressed() {
    pos.push([mouseX, mouseY]);
}

function keypressed() {

    pos.shift();
}