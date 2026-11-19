let data;

async function setup() {
  createCanvas(600,600);
  data = await loadTable('data/nyc_population_1950.csv',',','header');
  console.log(data);
}

function draw() {
  background(220);
}