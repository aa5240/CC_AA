/* Population of NYC in 1950

Source: Population of NYC by borough 1940 - Today
https://data.cityofnewyork.us/City-Government/New-York-City-Population-by-Borough-1950-2040/xywu-7bv9

Data was cleaned up using Google Sheets before importing into this program. Read about this process here:
https://docs.google.com/document/d/1xpCkKEDmZv6QD6SyWJRzm6IlX6yG84ZoYRUsLU6e82A/edit?tab=t.0#heading=h.tfjzonc10t0x

Proportional Area Chart: https://datavizproject.com/data-type/proportional-area-chart/

Goals:
- Incorporate data from a CSV about NYC's population in 1950
- Have the shape sizes correlate to the population of boroughs

*/

let nyc, nyc1950, totalPopulation;

let boroughNames = [];
let boroughHeight = [];
let scaledSizes = [];

// colors
let c = ["black", "red", "orange", "yellow", "green", "purple"];

async function setup() {
  // load CSV Data
  nyc = await loadTable(
    "data/nyc_population_1950_clean.csv",
    ",",
    "header"
  );

  createCanvas(500, 500);

  // outputs arrays
  nyc1950 = nyc.getColumn("1950").map(Number); // map(Number) converts from string to a number 
  
  boroughNames = nyc.getColumn("Borough");

  totalPopulation = nyc1950[0];

  // print to see data 
  console.log(nyc1950, boroughNames, scaledSizes);

}

function draw() {

  background(220);

}