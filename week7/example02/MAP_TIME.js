
let pMapper;
let quad0, quad1; // two surfaces

// Texture 1 variables
let x = [];
let y = [];
let ySpeed = [];
const numCircles = 60; // max # of seconds
let c = []; // for colors
let spacing = 20; // Distance between tick points
let words = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let wordCount = 50;
let position;
let hue;
let activeWords = []; // Global array to hold word positions
// Texture 2 variables
let pos = 0;
let myAnimation;
const b = ["#F44336", "#8BC34A", "#03A9F4"];
const f = ["#FF9800", "#FF0C94", "#F7FF96"];

// LLM recommended switching to async function setup() to avoid errors with pMapper
async function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
  position = floor(random(0, words.length - wordCount));
    // create mapper object
    pMapper = createProjectionMapper(this);

    quad0 = pMapper.createQuadMap(730,730); // width+height
    quad1 = pMapper.createQuadMap(200,200); // width+height

    // loads calibration in the "maps" directory
    //pMapper.load("maps/map.json");

    ahmadSetup1();
    ahmadSetup2();
}

function draw() {
    background(0);
    quad0.displaySketch(ahmadTexture1);
    quad1.displaySketch(ahmadTexture2);

}

function keyPressed() {
    switch (key) {
        case "c":
            pMapper.toggleCalibration();
            break;
        case "f":
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case "l":
            pMapper.load("maps/map.json");
            break;

        case "s":
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* First Texture/Sketch */

// Helper function to pick new words and positions
function updateWords() {
  activeWords = [];
  for (let i = 0; i < 10; i++) {
    activeWords.push({
      text: random(words),
      x: random(730),
      y: random(730),
      size: random(16, 48)
    });
  }
}

function ahmadSetup1() {
  c = [];
  for (let i = 0; i < numCircles; i++) {
    c.push(color(random(255), random(255), random(255)));
  }
  updateWords(); // Initialize first set of words
}

function ahmadTexture1(pg) {
  pg.push(); // 1. Start main buffer state

  // Layout variables & lerped background color
  let cols = 10;
  let spacing = pg.width / cols;

  let t = (frameCount % 300) / 300; 
  let bg = paletteLerp(
    [
      [b, 0],
      [b[7], 0.5],
      [b[8], 1],
    ],
    t
  );
  pg.background(bg); 

  // 2. Grid of Ticks Across Full Surface
  pg.push();
  pg.stroke(255);
  pg.strokeWeight(20);
  for (let x = spacing / 2; x < pg.width; x += spacing) {
    for (let y = spacing / 2; y < pg.height; y += spacing) {
      pg.point(x, y);
    }
  }
  pg.pop();

  pg.noStroke();

  // 3. Seconds Loop
  for (let s = 0; s < second(); s++) {
    let col = s % cols;
    let row = floor(s / cols);
    let xPos = col * spacing + spacing / 2;
    let yPos = row * spacing + spacing / 2;

    pg.fill(c[s]);
    pg.circle(xPos, yPos, 30);
  }

  // 4. Minutes Loop
  for (let m = 0; m < minute(); m++) {
    let xPos = (m * 20) % pg.width;
    let yPos = 40;
    pg.fill(0, 200, 255);
    pg.rect(xPos, yPos, 15, 15);
  }

  // 5. Hours Loop
  for (let h = 0; h < hour() % 12; h++) {
    let xPos = (h * 30) % pg.width;
    let yPos = 80;
    pg.fill(150, 100, 0);
    pg.square(xPos, yPos, 20);
  }

  // 6. Border Box
  pg.noFill();
  pg.strokeWeight(15);
  pg.stroke(255, 255, 0);
  pg.rect(0, 0, pg.width, pg.height);

   // 7. Update words once every 60 frames (~1 second)
  if (frameCount % 60 === 0) {
    updateWords();
  }

  // 8. Draw Lerped Text Layer
  let textColor = paletteLerp(
    [
      [f, 0],
      [f[5], 0.5],
      [f[6], 1],
    ],
    t
  );

  pg.textFont('Space Mono');
  pg.textAlign(CENTER);
  pg.fill(textColor); // Apply lerped color to text

  for (let i = 0; i < activeWords.length; i++) {
    let w = activeWords[i];
    pg.textSize(w.size);
    pg.text(w.text, w.x, w.y);
  }

  pg.pop(); // End main buffer state cleanly
}
function ahmadSetup2() {
  const duration = 1000; // 1 second
  myAnimation = setInterval(fillColors, duration);
}

function ahmadTexture2(pg) {
  pg.push(); 
  pg.noStroke();
  let r = 10; // rate in seconds
  let t = (millis() % (r * 1000)) / (r * 1000); // total loop time, outputs 0-1

  // bg color
  bg = paletteLerp(
    [
      [b[0], 0],
      [b[1], 0.5],
      [b[2], 1],
    ],
    t
  );
  pg.background(bg);
  // size of shape
  let s = map(t, 0, 1, 0, 300);

  // fill of shape, position controlled by fillColors()
  pg.fill(f[pos]);
  
  pg.ellipse(100, 100, s);

  pg.pop();
}

function fillColors() {
  if (pos == b.length - 1) {
    pos = 0;
  }
  pos++;
}