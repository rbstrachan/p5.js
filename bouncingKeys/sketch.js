// by [reiwa](https://github.com/rbstrachan/p5.js)

// inspiration from
// https://github.com/CodingTrain/Suggestion-Box/issues/317

// let _todo = [
//   'fix bouncing calculation to account for when the key doesnt land flat',
//   'add text labels to sliders'
// ];

// let _new = [
//   'you can now customise default functionality and properties via checkboxes and sliders',
//   'keys are now assigned random colors by default',
//   'keys 'F' and 'J' now have homing bars',
//   'keys now look like actual mechanical keyboard keys',
//   'keys now rotate as a function of their horizontal direction, left rotates left, right rotates right',
//   'keys now rotate slightly faster',
//   'keys now get deleted when off screen to improve performance'
// ];

// declare global variables
let keys = []; // initialize a new array to hold the list of keys pressed
let colours = [
  { backRect: '#d9201d', foreRect: '#f94434', foreRectStroke: '#c31d1a', letter: '#fff' }, // red
  { backRect: '#ff891d', foreRect: '#ffb048', foreRectStroke: '#e57b1a', letter: '#000' }, // orange
  { backRect: '#fff633', foreRect: '#ffff45', foreRectStroke: '#e5dd2e', letter: '#000' }, // yellow
  { backRect: '#00ad57', foreRect: '#45d178', foreRectStroke: '#009b4e', letter: '#000' }, // green
  { backRect: '#00d2fb', foreRect: '#65ffff', foreRectStroke: '#00bde1', letter: '#000' }, // blue
  { backRect: '#8473db', foreRect: '#a490fc', foreRectStroke: '#7767c5', letter: '#000' }, // violet
  { backRect: '#ccc', foreRect: '#fcfcfc', foreRectStroke: '#b7b7b7', letter: '#000'}     // gray
];
let textSizeSlider, strokeWeightSlider, resetButton, randomColourCheckbox, spinCheckbox, traceCheckbox;
let tssDefault = 30;
let rectStrokeWidth;

// this function is automatically called once by p5.js on page load
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255)
  textAlign(CENTER, CENTER);
  fill(0);
  
  // define checkboxes to allow user to define functionality
  randomColourCheckbox = createCheckbox(' color the keys randomly', false);
  randomColourCheckbox.position(width - 250, 10);
  
  spinCheckbox = createCheckbox(' spin the keys as they fly', true);
  spinCheckbox.position(width - 250, randomColourCheckbox.height + 7);
  
  traceCheckbox = createCheckbox(' keys produce a trail', false);
  traceCheckbox.position(width - 250, spinCheckbox.height + 24);

  // add a reset button to clear the canvas and delete all Key objects
  resetButton = createButton('reset');
  resetButton.position(width / 2, 10);
  resetButton.mousePressed(() => {
    keys.length = 0;
    background(255);
  });

  // add sliders for interactivity
  textSizeSlider = createSlider(10, 50, tssDefault);
  textSizeSlider.position(10, 10);
  
  strokeWeightSlider = createSlider(1, 6, 3);
  strokeWeightSlider.position(10, 30);
}

// when a key is pressed, construct a new Key object and initialize its default parameters
function keyPressed() {
  let newKey = new Key(keyCode, random((width / 2) - 50, (width / 2) + 50), height);
  keys.push(newKey); // push the Key object to the keys array
}

// the draw function is automatically called by p5.js every frame
function draw() {
  textSize(textSizeSlider.value());
  rectStrokeWidth = strokeWeightSlider.value() * textSizeSlider.value() / tssDefault;
  
  // if selected, redraw the white background every frame to prevent ghosting 
  if (!traceCheckbox.checked()) background(255);

  // for each key, update its parameters, then draw it
  for (let i = keys.length - 1; i >= 0; --i) {
    keys[i].update();
    keys[i].drawKey();

    // there is no need to continue updating keys that have gone off the screen
    // remove out-of-view keys from the keys array
    if (keys[i].x + (keys[i].size * sqrt(2)) < 0 || keys[i].x > width) {
      keys.splice(i, 1);
    }
  }
}

// define the Key class
class Key {
  // the constructor takes the keyCode and an initial position as arguments
  constructor(code, x, y) {
    this.letter = String.fromCharCode(code); // convert the keyCode to a string
    this.x = x;
    this.y = y;
    this.vy = -random(15, 30); // choose an initial upwards velocity at random
    this.vx = random(3, 9) * (Math.random() < 0.5 ? -1 : 1); // choose a horizontal speed at random, including wether the key will go to the left or the right
    this.size = textSize() * 3.5; // set the size of the key as a function of the user define textSize
    this.angle = 0;
    this.rotSpeed = random(0.075, 0.125) * (this.vx < 0 ? -1 : 1); // set the speed of the rotation of the key at random, taking into account the direction the key is travelling
    this.colour = randomColourCheckbox.checked() ? random(colours) : colours[colours.length - 1]; // randomly set the colour of the key from the colours array if the user chooses 
  }
  
  update() {
    this.y += this.vy; // move the key up
    this.vy += 0.5; // decrease the vertical velocity to mimic gravity
    this.x += this.vx; // move the key horizontally as previously calculated
    this.angle += spinCheckbox.checked() ? this.rotSpeed : 0; // if user chooses, spin the keys
    
    // bounce off the bottom
    // if the `y` coordinate of the bottom of the key is greater than the height of the window, the key has touched the bottom of the screen, so we need to bounce
    // an additional check is performed to ensure the velocity of the key is positive (falling) to ensure this code is not run when the key is initially constructed
    if (this.y + this.size > height && this.vy > 0) {
      this.y = height - this.size; // place the key on the very bottom of the screen
      this.rotSpeed *= 0.9; // reduce its rotation speed to mimic friction
      this.vy *= -0.7; // invert the velocity to make it go up instead of down. reduce upward bounce to mimic loss of energy
    }
  }

  drawKey() {
    push(); // necessary to make sure changes are applied to each individual key and not all keys simulteanously -- same with pop() at the end

    // move the origin to the center of the key, rotate the key, then move the origin to the top left corner of the key for the operations that follow
    translate(this.x + this.size / 2, this.y + this.size / 2);
    rotate(this.angle);
    translate(-this.size / 2, -this.size / 2); // 
    
    // background rectangle
    fill(this.colour.backRect);
    stroke(0);
    strokeWeight(rectStrokeWidth);
    rect(0, 0, this.size, this.size, 5); // create the key with rounded corners of radius 5
    
    // foreground rectangle
    fill(this.colour.foreRect);
    stroke(this.colour.foreRectStroke);
    strokeWeight(rectStrokeWidth);
    rect(this.size * 1 / 8, this.size * 3 / 32, this.size * 3 / 4, this.size * 3 / 4, 3);
    noStroke(); // remove the stroke to prevent the key letters inheriting it
    
    // if the key is an 'F' or 'J', add a homing bar
    if (this.letter == 'F' || this.letter == 'J') {
      fill(this.colour.backRect);
      rect(this.size * 5 / 12, this.size * 17 / 24, this.size / 4, this.size / 20, 1);
    }
    
    // add the string of the letter that was pressed to the key
    fill(this.colour.letter);
    textFont('Inter');
    textStyle(NORMAL);
    text(this.letter, this.size / 3, this.size / 3);
    
    pop();
  }
}