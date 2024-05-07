/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Butterfly", 
      assetUrl: "img/147butterfly.png",
      credit: "Generated with OpenArt"
    },
    {
      name: "Person", 
      assetUrl: "img/manimage.jpg",
      credit: "iStock Stock Images"
    },
    {
      name: "Cave", 
      assetUrl: "img/cave.webp",
      credit: "Wyatt Peterson"
    },
  ];
}
let numShapes;

function initDesign(inspiration) {

    // set the canvas size based on the container
    let canvasContainer = $('.image-container'); // Select the container using jQuery
    let canvasWidth = canvasContainer.width(); // Get the width of the container

    $(".caption").text(inspiration.credit); // Set the caption text
  
    // add the original image to #original
    let imgHTML;
  // Adjust the number of shapes based on the name of the inspiration
  switch (inspiration.name) {
  case "Butterfly":
    imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/2}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
    numShapes = 400;
    resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4); // Adjust the canvas resize factor to 10
    break;
  case "Person":
    imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/2}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
    numShapes = 200;
    resizeCanvas(inspiration.image.width / 3, inspiration.image.height / 3); // Adjust the canvas resize factor to 10
    break;
  case "Cave":
    imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/2}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
    numShapes = 1800;
    resizeCanvas(inspiration.image.width /8, inspiration.image.height / 8); // Adjust the canvas resize factor to 10
    break;
  }
  
  
  let design = {
    bg: inspiration.image.get(0, 0),
    fg: []
  }
  
  for(let i = 0; i < numShapes; i++) {
    let colorFromImage = inspiration.image.get(int(random(inspiration.image.width)), int(random(inspiration.image.height)));
    let x = random(width);
    let y = random(height);
    if (inspiration.name == "Person")
    {
      design.fg.push({
        x: x,
        y: y,
        diameter: random(10, 20),
        fill: colorFromImage
      });
    }
    if (inspiration.name == "Butterfly")
    {
      design.fg.push({
        x: random(width/10),
        y: random(height/10),
        w: random(width/20),
        h: random(height/20),
        fill: colorFromImage
      });
    }
    if (inspiration.name == "Cave")
    {
      design.fg.push({
        x: random(width/2),
        y: random(height/2),
        w: random(width/30),
        h: random(height/30),
        fill: colorFromImage
      });
    }

  }
  
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  
  if (inspiration.name === "Person") {
    for (let box of design.fg) {
      fill(box.fill, 128);
      ellipse(box.x, box.y, box.diameter, box.diameter);
    }      
  } else if (inspiration.name === "Butterfly") {
    for (let box of design.fg) {
      fill(box.fill, 128);
      rect(box.x, box.y, box.w, box.h);
    }      
  } else if (inspiration.name === "Cave") {
    for (let box of design.fg) {
      fill(box.fill, 128);
      triangle(
        box.x, box.y,
        box.x + box.w, box.y,
        box.x + box.w / 2, box.y + box.h
      );
    }      
  }
}


function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    if (inspiration.name == "Person")
    {
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.diameter = mut(box.diameter, 0, 20, rate);    
    }
    if (inspiration.name == "Butterfly")
    {
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width/5, rate);
      box.h = mut(box.h, 0, height/5, rate); 
    }
    if (inspiration.name == "Cave")
    {
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width/5, rate);
      box.h = mut(box.h, 0, height/5, rate); 
    }
  }
}


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}

