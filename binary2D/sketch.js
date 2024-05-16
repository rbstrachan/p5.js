// by [reiwa](github.com/rbstrachan) with love

// todo = [
  // "add validation checks, such as correct locator blocks, the presence of 10101010... striped lines between locator blocks. also checks for other codes such as data matrix, etc.",
  // "allow colors to be inverted"
// ];

let binaryString = "111111100000010110011110101111111100000101100000011010000101000001101110101000011111011101001011101101110101000100000010010101011101101110101001001010101100101011101100000101111111100110000001000001111111101010101010101010101111111000000000101000111010000000000000001001111101110010101101110111110111011010110100011111001000100000111101110001100000111111101000001110000000011001001010010110100010100000101101001101110111111001111100100010011111000011000101000000000110110001010110111111100100001101101000010101101011000011011010111100101011111000011101101111111010000001100101001101000100100000111011110111011110010101111001001100111001000100001100001011101010101001100010011010100101011111101011100010110011001001101011101110110111110101101110110101011001101000110010101100001101001010001000110001100010011110011101111110110000000001100000010000110100010100111111101100010001110001101011001100000101101011100101101100011001101110100101001001010101111111101101110100000001110010101110100101101110101101111011001110001010011100000100110011000010111000100000111111100101001100011100111011101";
let codeVersion;
let border = 0; // start the 2D code rectangle placement offset from the top left corner of the canvas

function setup() {  
  noStroke();
  
  // get textarea element and add an input event listener
  const textArea = document.getElementById("qrData");
  textArea.addEventListener("input", () => {
    binaryString = textArea.value.replace(/(\r\n|\n|\r|\s)/gm, "").trim();
    draw2DCode(); 
  });
   
  draw2DCode();
  
  console.log("Hello, hacker! 😉\nUsing dark mode? Type `setBorder();` with an optional width parameter into the console.\nVisual error detection is disabled while a border is present.")
}

function draw2DCode() {
  // ensure the input is valid binary and remove all whitespace characters
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