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
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
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

  /*
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  */
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
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Initialize all cells as empty
      row.push("_");
    }
    grid.push(row);
  }

  // Generate rooms
  let rooms = generateRooms(grid, numCols, numRows);

  // Connect rooms with hallways
  connectRooms(grid, rooms);

  // Place chests in each room
  placeChests(grid, rooms, "C"); // Specify the code for chests here

  return grid;
}



function generateRooms(grid, numCols, numRows) {
  let minRoomSize = 3; // Minimum size of a room
  let maxRoomSize = 5; // Maximum size of a room
  let numRooms = 5; // Number of rooms to generate
  let rooms = [];

  // Generate rooms randomly
  for (let r = 0; r < numRooms; r++) {
    // Determine the position and size of the room randomly
    let roomWidth = floor(random(minRoomSize, maxRoomSize + 1));
    let roomHeight = floor(random(minRoomSize, maxRoomSize + 1));
    let roomStartX = floor(random(0, numCols - roomWidth));
    let roomStartY = floor(random(0, numRows - roomHeight));

    // Check for overlapping rooms
    let overlapping = false;
    for (let room of rooms) {
      if (
        roomStartX < room.startX + room.width &&
        roomStartX + roomWidth > room.startX &&
        roomStartY < room.startY + room.height &&
        roomStartY + roomHeight > room.startY
      ) {
        overlapping = true;
        break;
      }
    }

    // If no overlap, draw the room outline
    if (!overlapping) {
      for (let i = roomStartY; i < roomStartY + roomHeight; i++) {
        for (let j = roomStartX; j < roomStartX + roomWidth; j++) {
          if (i === roomStartY || i === roomStartY + roomHeight - 1 || j === roomStartX || j === roomStartX + roomWidth - 1) {
            grid[i][j] = ".";
          }
        }
      }
      // Store room information
      rooms.push({
        startX: roomStartX,
        startY: roomStartY,
        width: roomWidth,
        height: roomHeight
      });
    }
  }

  return rooms;
}

function connectRooms(grid, rooms) {
  // Connect rooms with hallways
  for (let i = 0; i < rooms.length - 1; i++) {
    let roomA = rooms[i];
    let roomB = rooms[i + 1];

    // Find closest points between rooms
    let closestA = findClosestPoint(roomA, roomB);
    let closestB = findClosestPoint(roomB, roomA);

    // Connect the closest points with a path
    let currentPoint = { x: closestA.x, y: closestA.y };
    while (currentPoint.x !== closestB.x || currentPoint.y !== closestB.y) {
      grid[currentPoint.y][currentPoint.x] = "P";
      let choice = random() > 0.5 ? "x" : "y";
      if (choice === "x") {
        if (currentPoint.x < closestB.x) currentPoint.x++;
        else if (currentPoint.x > closestB.x) currentPoint.x--;
      } else {
        if (currentPoint.y < closestB.y) currentPoint.y++;
        else if (currentPoint.y > closestB.y) currentPoint.y--;
      }
    }
  }
}

function findClosestPoint(roomA, roomB) {
  // Find the closest point in roomA to roomB
  let closestPoint = { x: roomA.startX, y: roomA.startY };
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (let i = roomA.startY; i < roomA.startY + roomA.height; i++) {
    for (let j = roomA.startX; j < roomA.startX + roomA.width; j++) {
      let distance = dist(j, i, roomB.startX + roomB.width / 2, roomB.startY + roomB.height / 2);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint.x = j;
        closestPoint.y = i;
      }
    }
  }
  return closestPoint;
}

function placeChests(grid, rooms, chestCode) {
  for (let room of rooms) {
    let chestX = floor(random(room.startX + 1, room.startX + room.width - 2)); // Random x position for chest
    let chestY = floor(random(room.startY + 1, room.startY + room.height - 2)); // Random y position for chest
    grid[chestY][chestX] = chestCode;
  }
}


function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "_")) {
        // Render floor tiles
        // Apply shadow effect
        placeTile(i, j, floor(random(21, 24)), 23); 
        let brightness = map(sin(millis() * 0.01), -1, 1, 100, 255); // Example: Modulate brightness over time
        fill(0, brightness); // Apply dynamic brightness
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
      } else if(gridCheck(grid, i, j, ".")) {
        // Apply shadow effect
        if (random() < 0.01) {
          // Example: Randomly change appearance 1% of the time
          fill(random(255), random(255), random(255)); // Random color
          rect(j * tileSize, i * tileSize, tileSize, tileSize);
        } else {
          placeTile(i, j, floor(random(1, 4)), 21);
        }
      } else if(gridCheck(grid, i, j, "P"))
      {
        placeTile(i, j, floor(random(1, 4)), 15);         
      } else if(gridCheck(grid, i, j, "C")) {
        // Render chest tiles
        // Apply shadow effect
        fill(0, 100); // Semi-transparent black for chests
        rect(j * tileSize, i * tileSize, tileSize, tileSize);
        placeTile(i, j, floor(random(0,3)), 30); // Render chest tile on top
      } else {
        // Render other tiles from the tileset
        drawContext(grid, i, j, "_", floor(random(21,24)), 23);
      }
    }
  }

  // Render shadows on top of the tiles
  drawShadows();
}

function drawShadows() {
  // Update shadow offset based on time
  let shadowOffset = millis() * 0.001; // Adjust speed of shadow movement
  
  // Draw translucent rectangles for shadows
  fill(0, 100); // Semi-transparent black for shadows
  noStroke(); // No outline for shadows

  // Loop through the grid to render shadows
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      // Calculate noise value for current position
      let noiseValue = noise(j * 0.01, i * 0.01 + shadowOffset);
      
      // Map noise value to shadow size and position
      let shadowSize = map(noiseValue, 0, 1, 0, tileSize * 2); // Adjust shadow size
      let shadowX = j * tileSize - tileSize / 2; // Center shadow horizontally
      let shadowY = i * tileSize - tileSize / 2; // Center shadow vertically

      // Draw the shadow rectangle
      rect(shadowX, shadowY, shadowSize, shadowSize);
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


