// by [reiwa](github.com/rbstrachan)
// inspiration from https://github.com/CodingTrain/Suggestion-Box/issues/1820

// _todo = [
  // improve spinning cube -- currently does not trace a perfect circle as math is wrong. see Chris GH code
  // improve keys object and keyPressed() function → make each value in the keys object an object with keys like `key`, `amountOfLines`, `refreshBackground`, etc.
  // add ability to have an animated line for which each of its endpoints bounces of the corners of the window (b key)
  // see https://github.com/ChrisBLong/POV and related yt videos
// ];

// _features = [
  // push 'L' to draw a single line
  // push 'N' to draw 10 lines
  // push 'M' to draw 100 lines
  // push 'C' to animate a rotating cube
  // push 'S' to fill the background with static
  // push 'R' to reset the canvas
  // push 'E' to reset the canvas then draw a single line
// ];

let gridSize = 5; // set the size of each virtual pixel relative to your display's actual pixels
let grid;

let keys = { l: 1, n: 10, m: 100 };

let cKeyToggle = false;
let pitch = 0;
let yaw = 0;
let radius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = create2DArray(windowWidth / gridSize, windowHeight / gridSize);
  fill(0);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
}

function draw() {
  if (cKeyToggle) drawCube();
}

function keyPressed() {
  keyHandler(key);
}

function keyHandler(key) {
  let keyName = key.toLowerCase();
  if (keyName == "r") { resetGrid(); return }
  if (keyName == "e") { updateGrid(true); return }
  if (keyName == "s") { renderStatic(); return }
  if (keyName == "c") { cKeyToggle = cKeyToggle ? false : true; return}
  for (let i = 0; i < keys[keyName]; i++) {
    updateGrid();
  }
}

function updateGrid(refresh = false) {
  // reset the grid
  if (refresh) resetGrid();
  
  // pick two random points within the grid
  let x1 = floor(random(grid.length));
  let y1 = floor(random(grid[x1].length));
  let x2 = floor(random(grid.length));
  let y2 = floor(random(grid[x2].length));

  // use Bresenham's line algorithm to iterate over pixels on the line
  drawBresenhamLine(x1, y1, x2, y2);
}

function resetGrid() {
  // reset the grid to all black pixels
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
  fill(0);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
}

function renderStatic() {
  // loop through each cell in the grid and set it randomly to black (0) or white (255)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = random() < 0.5 ? 0 : 255;
      fill(grid[i][j]);
      // noStroke();
      rect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
}

function drawBresenhamLine(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1); // absolute distance between the two points' x coords
  let sx = x1 < x2 ? 1 : -1; // set the direction the algorithm will move along the x axis
  let dy = Math.abs(y2 - y1); // absolute distance between the two points' y coords
  let sy = y1 < y2 ? 1 : -1; // set the direction the algorithm will move along the y axis
  let err = dx - dy; //

  while (true) {
    // invert the color of the current pixel in the grid
    // set fill() to that color
    // draw a rectangle at the current position at the correct size
    grid[x1][y1] = 1 - grid[x1][y1];
    fill(grid[x1][y1] * 255);
    rect(x1 * gridSize, y1 * gridSize, gridSize, gridSize);

    // Bresenham's line algorithm
    if (x1 === x2 && y1 === y2) break; // check if we have reached the end of the line and if so, stop
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

function drawCube() {
  let positionX = windowWidth / 10;
  let positionY = windowHeight / 10;
  let topX = [], topY = [], botX = [], botY = [];
  
  radius = positionY / 2;
  pitch -= Math.PI / 200;
  yaw += Math.E / 200;

  // calculate line points
  topX.push(Math.sin(yaw) * radius + positionX);
  topX.push(Math.sin(yaw + Math.PI / 2) * radius + positionX);
  topX.push(Math.sin(yaw + Math.PI) * radius + positionX);
  topX.push(Math.sin(yaw + Math.PI * 3 / 2) * radius + positionX);
  
  topY.push(Math.cos(yaw) * radius * Math.sin(pitch) + Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  topY.push(Math.cos(yaw + Math.PI / 2) * radius * Math.sin(pitch) + Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  topY.push(Math.cos(yaw + Math.PI) * radius * Math.sin(pitch) + Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  topY.push(Math.cos(yaw + Math.PI * 3 / 2) * radius * Math.sin(pitch) + Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  
  botX.push(Math.sin(yaw) * radius + positionX);
  botX.push(Math.sin(yaw + Math.PI / 2) * radius + positionX);
  botX.push(Math.sin(yaw + Math.PI) * radius + positionX);
  botX.push(Math.sin(yaw + Math.PI * 3 / 2) * radius + positionX);
  
  botY.push(Math.cos(yaw) * radius * Math.sin(pitch) - Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  botY.push(Math.cos(yaw + Math.PI / 2) * radius * Math.sin(pitch) - Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  botY.push(Math.cos(yaw + Math.PI) * radius * Math.sin(pitch) - Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  botY.push(Math.cos(yaw + Math.PI * 3 / 2) * radius * Math.sin(pitch) - Math.cos(pitch) * Math.sqrt(2 * radius ^ 2) * 3 + positionY);
  
  // draw lines
  for (let i = 0; i < 4; ++i) {
    drawBresenhamLine(round(topX[i]), round(topY[i]), round(topX[(i + 1) % 4]), round(topY[(i + 1) % 4])); // upper face
    drawBresenhamLine(round(botX[i]), round(botY[i]), round(botX[(i + 1) % 4]), round(botY[(i + 1) % 4])); // lower face
    drawBresenhamLine(round(topX[i]), round(topY[i]), round(botX[i]), round(botY[i])); // connections
  }
}

function create2DArray(cols, rows) {
  let arr = [];
  for (let i = 0; i < cols; i++) {
    arr.push([]);
    for (let j = 0; j < rows; j++) {
      arr[i].push(0);
    }
  }
  return arr;
}
