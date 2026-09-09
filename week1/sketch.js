// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "unique because it makes kinetic pictures of indefinite duration and responsive", source: "Casey" },
  { text: "the painter who stands back between brushstrokes ", source: " Turkle and Papert" },
  { text: "A parallel development to the emergence of computing and its application in art", source: "Ilias" },
  { text: "generative, reflexive and anarchist intelligence of art with technical languge ", source: "Fuller" },
  { text: "can be listed as algorithms, randomness, semiotics and interactivity", source: "Fider" },
  { text: "to imagine a languge is to imagine life", source: "Ludwing" },
  { text: "the only languge that is excecutable", source: "Alexander" },
  { text: "a system of signs expressing ideas", source: "Seussure" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(21);
  fill(10, 255, 10);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(250, 10, 150); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  textAlign(LEFT, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 48);
  textStyle(BOLD);
  text("'" + current.text + "'", width / 2, height / 2);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 200, height - 100);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}