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

let worldSeed;
let clickCounter = 0; // Counter for the number of clicks

function p3_preload() {}

function p3_setup() {}

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
  clickCounter++; // Increment the click counter
}

function p3_drawBefore() {
  let breathingScale = 1 + 0.1 * sin(frameCount * 0.01); // Adjust the speed of breathing
  let breathingAlpha = 128 + 128 * sin(frameCount * 0.02); // Adjust the speed and intensity of alpha blending

  // Apply the breathing effect to the entire canvas
  scale(breathingScale);
  blendMode(BLEND);
  fill(255, breathingAlpha); // Use white color with breathing alpha
  rectMode(CORNER);
  rect(0, 0, width, height); // Draw a rectangle covering the canvas

  // Reset transformations
  resetMatrix();
}

function p3_drawTile(i, j) {
  noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    // Generate a random color for the shaded tile
    let shadedColor = color(random(255), random(255), random(255));
    // Check if the tile should blink slowly
    let blink = frameCount % 120 < 60; // Blink every 2 seconds
    if (blink) {
      // If blinking, use white color
      fill(255);
    } else {
      // If not blinking, use the random shaded color
      fill(shadedColor);
    }
  } else {
    // Default color for non-shaded tiles
    fill(255, 200);
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  endShape(CLOSE);

  beginShape();
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    if (frameCount % 60 < 30) { // Blinking effect (slow blink)
      fill(255, 0, 0, 128); // Red color for shaded tiles
    } else {
      fill(255, 200); // Default color
    }
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(0, -th);
    endShape(CLOSE);
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  endShape(CLOSE);

  beginShape();
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
