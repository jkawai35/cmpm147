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

function p3_preload() {}

function p3_setup() {}

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

let ripples = []; // Array to store active ripples

let waterOffset = 0;

function p3_drawBefore() {
  waterOffset += 0.01; // Adjust the speed of the water effect
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  // Increment the click count for the clicked tile
  clicks[key] = (clicks[key] || 0) + 1;
}

// Define a fade duration for the cross
let crossFadeDuration = 60; // Number of frames for the cross to fade out

function p3_drawTile(i, j) {
  noStroke();

  // Determine the color of the tile based on noise or other criteria
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    // Sky blue color
    fill(135, 206, 235); // RGB values for sky blue
  } else {
    // Calculate a shade of blue based on Perlin noise
    let waterColor = color(50, 100, 250 * noise(i * 0.1, j * 0.1, waterOffset));
    fill(waterColor);
  }

  // Check if the tile or any adjacent tiles have been clicked
  let key = [i, j];
  let clicked = clicks[key] || 0;
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      // Exclude diagonals to create a plus sign shape
      if (abs(xOffset) + abs(yOffset) === 1) {
        let neighborKey = [i + xOffset, j + yOffset];
        if (clicks[neighborKey] > 0) {
          clicked = true;
          break;
        }
      }
    }
  }

  if (clicked) {
    // Calculate alpha value based on a breathing effect
    let fadeAmount = (cos(frameCount * 0.1) + 1) / 2; // Oscillates between 0 and 1
    let alpha = map(fadeAmount, 0, 1, 0, 255); // Map the value to the alpha range
    // Use a light blue color for the cross tiles
    let crossColor = color(173, 216, 230); // Light blue color
    fill(crossColor, alpha); // Set fill color to light blue with calculated alpha value
  }

  // Draw the tile shape
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  // Decrease alpha value of clicked tiles over time
  if (clicked && clicks[key] > 0) {
    let fadeAmount = 1 / crossFadeDuration; // Calculate the amount to fade per frame
    clicks[key] -= fadeAmount; // Decrease the alpha value gradually
    clicks[key] = max(clicks[key], 0); // Ensure the alpha value doesn't go below 0
  }
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

function p3_drawAfter() {
}
