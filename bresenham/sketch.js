// by [reiwa](github.com/rbstrachan/p5.js)

// inspiration from
// https://github.com/CodingTrain/Suggestion-Box/issues/1820
// https://github.com/ChrisBLong/POV

// code for 3D → 2D rotating cube taken from
// Daniel Shiffman / Coding Train
// Coding Challenge #112: 3D Rendering with Rotation and Projection
// https://thecodingtrain.com/challenges/112-3d-rendering-with-rotation-and-projection
// https://youtu.be/p4Iz0XJY-Qk
// p5: https://editor.p5js.org/codingtrain/sketches/r8l8XXD2A

// _todo = [
  // 'add ability to have an animated line for which each of its endpoints bounces of the corners of the window (b key)'
// ];

// _features = [
  // 'push 'L' to draw a single line',
  // 'push 'N' to draw 10 lines',
  // 'push 'M' to draw 100 lines',
  // 'push 'C' to animate a rotating cube',
  // 'push 'S' to fill the background with static',
  // 'push 'R' to reset the canvas',
  // 'push 'E' to reset the canvas then draw a single line'
// ];

let gridSize = 5; // set the size of each virtual pixel relative to your display's actual pixels
let grid;

let keys = { l: 1, n: 10, m: 100 };

let cKeyToggle = false;

let angle = 0;
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = create2DArray(windowWidth / gridSize, windowHeight / gridSize);
  fill(0);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
  
  points[0] = createVector(-1, -1, -1);
  points[1] = createVector(1, -1, -1);
  points[2] = createVector(1, 1, -1);
  points[3] = createVector(-1, 1, -1);
  points[4] = createVector(-1, -1, 1);
  points[5] = createVector(1, -1, 1);
  points[6] = createVector(1, 1, 1);
  points[7] = createVector(-1, 1, 1);
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

// reset the grid to all black pixels
function resetGrid() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
  fill(0);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
}

// loop through each cell in the grid and set it randomly to black (0) or white (255)
function renderStatic() {
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
  const rotationZ = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1],
  ];

  const rotationX = [
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ];

  const rotationY = [
    [cos(angle), 0, sin(angle)],
    [0, 1, 0],
    [-sin(angle), 0, cos(angle)],
  ];

  let projected = [];
  
  // rotate then project the points
  for (let i = 0; i < points.length; i++) {
    let rotated;
    rotated = matmul(rotationY, points[i]);
    rotated = matmul(rotationX, rotated);
    rotated = matmul(rotationZ, rotated);
    let distance = 4;
    let z = 1 / (distance - rotated.z);
    const projection = [
      [z, 0, 0],
      [0, z, 0],
    ];
    let projected2d = matmul(projection, rotated);

    // zoom the cube to fit the window size
    projected2d.mult(windowHeight / 10 + 40);
    projected[i] = projected2d
    
    // move the cube the middle of the screen
    projected[i].x += grid.length / 2; // grid.length gives us the number of columns in the grid — in other words, its horizontal length
    projected[i].y += grid[0].length / 2; // the length of any individual element of the grid, in this case [0], gives ut the number of rows in the grid — in other words, its vertical height
  }
  
  // draw the cubes lines
  for (let i = 0; i < 4; i++) {
    drawBresenhamLine(round(projected[i].x), round(projected[i].y), round(projected[(i + 1) % 4].x), round(projected[(i + 1) % 4].y)); // front face
    drawBresenhamLine(round(projected[i + 4].x), round(projected[i + 4].y), round(projected[((i + 1) % 4) + 4].x), round(projected[((i + 1) % 4) + 4].y)); // back face
    drawBresenhamLine(round(projected[i].x), round(projected[i].y), round(projected[i + 4].x), round(projected[i + 4].y)); // connections
  }
  
  angle += 0.01; // rotate the cube by this much every frame
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
