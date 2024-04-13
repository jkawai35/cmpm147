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

/* exported setup, draw */
let seed = 0;
let mouseXOffset = 0;

let numLayers = 6;
let mountainColors = ['#556B2F', '#6B8E23', '#228B22', '#32CD32', '#3CB371', '#90EE90']; // Green shades
let valleyColor = '#2E8B57'; // Sea green color for the valley

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
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  background(100);

  let layerHeight = height / numLayers;
  let startY = height / 3;
  
  // Simulate sunset
  let sunsetColor = color(255, 165, 0); // Orange color for sunset
  let topColor = color(135, 206, 235); // Light blue color for top of the sky

  // Gradient background
  setGradient(0, 0, width, startY, topColor, sunsetColor);

  // Draw valley
  fill(valleyColor);
  rect(0, startY, width, height - startY);

  // Draw mountain layers every time the mouse is moved
  for (let i = 0; i < numLayers; i++) {
    stroke(0); // Black outline
    let colorIndex = int(random(mountainColors.length));
    let mountainColor = mountainColors[colorIndex];
    fill(mountainColor);
    drawMountainLayer(startY + i * layerHeight, startY + (i + 1) * layerHeight, 0.01 + i * 0.005, 20, 50);
  }

  // Adjust mouseXOffset based on mouse position
  mouseXOffset = map(mouseX, 0, width, -width * 0.25, width * 0.25); // Extend the range beyond the screen width
  
  let numBalloons = int(map(mouseX, 0, width, 20, 5)); // Decrease number of balloons as mouse moves to the right

  // Draw hot air balloons
  drawHotAirBalloons(numBalloons); // Draw 1 balloon
}

function drawMountainLayer(minY, maxY, noiseScale, jaggedness, stepSize) {
  beginShape();
  let yOffset = random(-20, 20);
  for (let x = -width * 0.25; x <= width * 1.25; x += stepSize) { // Extend the range beyond the screen width
    let y = map(noise((x + mouseXOffset) * noiseScale), 0, 1, minY, maxY); // Apply mouseXOffset to the x-coordinate
    y += random(-jaggedness, jaggedness) * 0.5; // Reduce the range of jaggedness
    y += yOffset; // Add random offset for overlapping effect
    vertex(x, y);
  }
  endShape(CLOSE);
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function drawHotAirBalloons(numBalloons) {
  noStroke();
  for (let i = 0; i < numBalloons; i++) {
    let x = map(i, 0, numBalloons - 1, -width * 0.25, width * 1.25);  // Spread the balloons evenly across the extended range
    let yNoise = random(10) + i * 0.1; // Random starting point for y noise, with slight variation for each balloon
    let y = map(noise(yNoise), 0, 1, height * 0.33, height * 0.67); // Use Perlin noise for y position, spread horizontally
    
    // Calculate distance between balloon and cursor
    let distanceToCursor = dist(x, y, mouseX, mouseY);

    // Adjust balloon size based on distance to cursor
    let size = map(distanceToCursor, 0, width, 60, 20); // Larger balloons closer to cursor, smaller balloons further away
    let ellipseWidth = size * random(0.8, 1.2);
    let ellipseHeight = size * random(1, 1.5);

    // Balloon body
    let balloonColor = color(random(255), random(255), random(255));
    fill(balloonColor);
    ellipse(x, y, ellipseWidth, ellipseHeight);

    // Balloon basket
    fill(139, 69, 19); // Brown
    let basketWidth = size * 0.2;
    let basketHeight = size * 0.3;
    let basketX = x;
    let basketY = y + ellipseHeight * 0.5;
    rect(basketX - basketWidth / 2, basketY, basketWidth, basketHeight);
  }
}
