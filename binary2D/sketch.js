// by [reiwa](github.com/rbstrachan)

// todo = [
  // "add validation checks, such as correct locator blocks, the presence of 10101010... striped lines between locator blocks. also checks for other codes such as data matrix, etc.",
  // "allow colors to be inverted",
  // "allow an image to be uploaded, then converted into binary",
  // "add a list of example strings and the codes they produce",
  // "simplify canvas and resolution calculations"
// ];

let binaryString, codeVersion;
let border = 0; // start the 2D code rectangle placement offset from the top left corner of the canvas

const textArea = document.getElementById('qrData');
// const button = document.getElementById('uploadImage');

function setup() {  
  noStroke();
  
  // add an input event listener to textarea element
  textArea.addEventListener("input", draw2DCode);
  
  // add an ? event listener to button element
  // button.addEventListener("?", (image) => import2DCode(image));
  
  draw2DCode();
  
  console.log("Hello, hacker! 😉\nUsing dark mode? Type `setBorder();` with an optional width parameter into the console.\nVisual error detection is disabled while a border is present.")
}

function draw2DCode() {
  // get input and ensure it is valid binary while removing all whitespace characters
  binaryString = textArea.value.replace(/(\r\n|\n|\r|\s)/gm, "").trim();
  validateInput();
  
  // calculate the version (size) of the 2D code as a function of the input string length
  codeVersion = ceil(sqrt(binaryString.length));
  const resolution = round(560 / codeVersion);
  
  // calculate the canvas size, create the canvas and set a background color
  const canvasSize = (codeVersion + border * 2) * resolution;
  createCanvas(canvasSize, canvasSize);
  border ? background(255) : background(255, 0, 0);
  
  // draw the 2D code
  for (let i = 0; i < binaryString.length; i++) {
    fill(255 - binaryString[i] * 255); // inverted ? 0 + binaryString[i] * 255 : 255 - binaryString[i] * 255
    rect((i % codeVersion + border) * resolution, (floor(i / codeVersion) + border) * resolution, resolution, resolution);
  }
}

// function import2DCode(image) {
//   // code here
// }

function validateInput() {
  if (!/^[01\n]+$/.test(binaryString)) {
    throw new Error("Invalid binary string. Only characters '0' and '1' are allowed.");
  }
}

function setBorder(n = 1) {
  border = n;
  draw2DCode();
  return console.log("Border set to " + n + "px.\n" + (n ? "Visual error detection is not available while a border is present.\nUse `setBorder(false);` to remove the border" : "Border removed. Visual error detection is available."));
}