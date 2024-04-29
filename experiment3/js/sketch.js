// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  redrawCanvas(); // Redraw everything based on new size
}

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;


function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

// setup() function is called once when the program starts
function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");
  
}
//place tile
function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}
// draw() function is called repeatedly, it's the main animation loop

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}


/* exported generateGrid, drawGrid */
/* global placeTile */
const tileSize = 32;

function generateGrid(numCols, numRows) {
  let grid = [];

  // Determine the size of each tile in the noise map
  let tileSize = 0.1;

  // Fill the grid based on Perlin noise
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Calculate Perlin noise value for the current position
      let noiseValue = noise(j * tileSize, i * tileSize);

      // Determine biome based on noise value
      let code;
      if (noiseValue < 0.5) {
        code = "_"; // Dark Water
      } else if (noiseValue < 0.6) {
        code = "F"; // Sand
      } else if (noiseValue < 0.8) {
        code = "L"; // Land
      } else {
        code = "D"; // Water
      }

      row.push(code);
    }
    grid.push(row);
  }

  // Place houses randomly in the grassland biome
  let numHouses = Math.floor(numCols * numRows * 0.02); // Adjust as needed
  for (let k = 0; k < numHouses; k++) {
    let houseX, houseY;
    do {
      // Generate random position within the grid
      houseX = Math.floor(random(numCols));
      houseY = Math.floor(random(numRows));
    } while (grid[houseY][houseX] !== "L"); // Ensure the position is within the land biome

    // Place the house
    grid[houseY][houseX] = "H"; // House
  }

  return grid;
}


// Initialize variables to control cloud animation
let cloudSpeed = 0.5; // Speed of cloud movement
let timeOffset = 0; // Offset to create variation in cloud movement

function drawGrid(grid) {
  // Update time offset for cloud movement
  timeOffset += 0.01;

  // Loop through each cell in the grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Draw tiles based on grid codes
      if (gridCheck(grid, i, j, "_")) {
        placeTile(i, j, floor(random(2)), 14); // Place random tile for other areas (like the lake)
      } else if (gridCheck(grid, i, j, "H")){
        placeTile(i, j, 26, floor(random(4))); // Place random tile for houses
      } else if (gridCheck(grid, i, j, "F")){
        // Variation in appearance for sand
        if (random() < 0.01) {
          let brightness = map(noise(i * 0.1, j * 0.1, millis() * 0.0001), 0, 1, 100, 255);
          fill(247, 243, 178, brightness); // Sand color with varying brightness
          rect(j * tileSize, i * tileSize, tileSize, tileSize);
        } else {
          placeTile(i, j, floor(random(3)), 18); // Place random tile for sand
        }
      } else if (gridCheck(grid, i, j, "D")){
        placeTile(i, j, floor(random(2)), 14) // Place random tile for water
      } else {
        drawContext(grid, i, j, "D", floor(random(2)), 0); // Draw context for other areas (water edges)
      }
    }
  }
  
  // Draw semi-transparent animated clouds
  let cloudOpacity = 100; // Adjust opacity as needed
  fill(255, cloudOpacity);
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Determine if a cloud should be drawn over this tile
      if (random() < 0.1) { // Adjust probability as needed
        // Calculate cloud position based on time, Perlin noise, and cloud speed
        let x = j * tileSize + 10 * noise(j * 0.1 + timeOffset);
        let y = i * tileSize + 10 * noise(i * 0.1 + timeOffset);
        // Apply cloud speed to adjust the position
        x += cloudSpeed;
        y += cloudSpeed;
        // Vary cloud size
        let cloudSize = random(0.5, 1.5) * tileSize;
        // Draw a cloud shape over the tile
        rect(x, y, cloudSize, cloudSize);
      }
    }
  }
}




function gridCheck(grid, i, j, target) {
  // Check if the location (i, j) is inside the grid bounds
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    // Check if the value at location (i, j) matches the target
    return grid[i][j] === target;
  }
  // If the location is out of bounds, return false
  return false;
}

function gridCode(grid, i, j, target) {
  // Check the north, south, east, and west neighbors of the cell at (i, j)
  let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;

  // Form a 4-bit code using the neighbor values
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);

  return code;
}

function drawContext(grid, i, j, target, ti, tj) {
  // Get the grid code for the current location and target
  let code = gridCode(grid, i, j, target);

  // Use the code as an array index to get the tile offset numbers
  let [tiOffset, tjOffset] = lookup[code];

  // Place the tile at the current location with the adjusted tile offsets
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

// Lookup table for tile offset pairs
const lookup = [
  [0, 0], // Empty
  [1, 0], // North
  [2, 0], // South
  [3, 0], // North + South
  [0, 1], // East
  [1, 1], // North + East
  [2, 1], // South + East
  [3, 1], // North + South + East
  [0, 2], // West
  [1, 2], // North + West
  [2, 2], // South + West
  [3, 2], // North + South + West
  [0, 3], // East + West
  [1, 3],
]

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}