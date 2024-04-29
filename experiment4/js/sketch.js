"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
let spotlight = {
  x: 0, // X-coordinate of the spotlight center
  y: 0, // Y-coordinate of the spotlight center
  radius: 100, // Radius of the spotlight
  alpha: 200, // Alpha value of the spotlight color
};

function p3_preload() {}

function p3_setup() {
  spotlight.radius = min(tw, th); // Set the radius based on the tile dimensions
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}



function p3_drawBefore() {

}

function p3_drawTile(i, j) {
  noStroke();

  // Determine color based on tile type or apply rainbow effect
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    // Fading white effect for tiles where condition is true
    let alpha = 128 + 128 * sin(frameCount * 0.05); // Adjust the speed of fading
    fill(255, alpha); // White color with variable alpha
  } else {
    // Calculate color based on Perlin noise for other tiles
    let hue = map(noise(i * 0.1, j * 0.1, frameCount * 0.01), 0, 1, 0, 360);
    let saturation = 100;
    let brightness = 100;
    colorMode(HSB);
    fill(hue, saturation, brightness);
  }
  
  let key = [i, j];
  let clicked = clicks[key] || 0;

  // Check if the current tile is clicked
  if (clicked) {
    drawSpotlight();
  }

  // Draw the shape of the tile
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  // Reset color mode to RGB
  colorMode(RGB);
}

function drawSpotlight() {
  // Set the color and transparency for the spotlight
  fill(0); // White with alpha
  // Draw a rectangle representing the spotlight
  rectMode(CENTER);
  rect(0, 0, tw, th);
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

