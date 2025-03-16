// by [reiwa](reiwa.ca)

// todo = [
  // "add validation checks, such as correct locator blocks, the presence of 10101010... striped lines between locator blocks. also checks for other codes such as data matrix, etc.",
  // "add a list of example strings and the codes they produce",
  // "simplify canvas and resolution calculations",
  // "add title and nav bar",
  // "give error messages on invalid input"
  // "add checks -- minimum and maximum image size, etc.",
// ];

let qrImage, size, binaryString, border = 0;
let invertColours = false;
const textArea = document.getElementById('codeData');
const fileInput = document.getElementById('imageUpload');
const copyButton = document.getElementById('copyButton');
const invertCheckbox = document.getElementById('invertColours');
const loadingSpinner = document.getElementById('loadingSpinner');
const downloadButton = document.getElementById('downloadButton');

function setup() {
  noStroke();
  
  // event listeners
  textArea.addEventListener("input", draw2DCode);
  fileInput.addEventListener('change', handleImageUpload);
  copyButton.addEventListener('click', copyTextAreaContent);
  invertCheckbox.addEventListener('change', () => {
    invertColours = invertCheckbox.checked;
    draw2DCode();
  })
  downloadButton.addEventListener('click', () => {
    save('binaryToQR.png');
  });
  
  draw2DCode();
  
  console.log("Hello, hacker! 😉\nUsing dark mode? Type `setBorder();` with an optional width parameter into the console.\nVisual error detection is disabled while a border is present.")
}

function copyTextAreaContent() {
  textArea.select();
  document.execCommand('copy');
  
  copyButton.textContent = 'Copied!';
  setTimeout(() => {
    copyButton.textContent = 'Copy';
  }, 2000);
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  loadingSpinner.style.display = 'block';
  
  reader.onload = function(e) {
    qrImage = loadImage(e.target.result, () => {
      try {
        convertImageToBinaryString();
      } catch (error) {
        alert(error.message);
      } finally {
        loadingSpinner.style.display = 'none';
      }
    });
  };
  
  reader.onerror = function() {
    loadingSpinner.style.display = 'none';
    alert('Error reading file');
  }
  
  reader.readAsDataURL(file);
}

function convertImageToBinaryString() {
  size = getQRCodeSize(qrImage);
  textArea.value = '';
  
  for (let y = 0; y < size; y++) {
    let rowBinaryString = "";
    for (let x = 0; x < size; x++) {
      const pixelColor = qrImage.get(
        (x * qrImage.width) / size + qrImage.width / size / 2,
        (y * qrImage.height) / size + qrImage.height / size / 2
      );
      const isBlack = brightness(pixelColor) < 50;
      rowBinaryString += isBlack ? "1" : "0";
    }
    textArea.value += rowBinaryString + "\n";
  }
  
  draw2DCode();
}

function getQRCodeSize() {
  qrImage.loadPixels();
  const qrCode = jsQR(qrImage.pixels, qrImage.width, qrImage.height);

  if (qrCode) {
    console.log(`data: ${qrCode.data}\n\nversion: ${qrCode.version}\nsize: ${17 + (qrCode.version * 4)}`);
    return 17 + (qrCode.version * 4);
  } else {
    throw new Error("Could not read a QR code from the image. This function only works with QR codes. Check the image you uploaded is a valid QR code and try again.");
  }
}

function draw2DCode() {
  // get input and ensure it is valid binary while removing all whitespace characters
  binaryString = textArea.value.replace(/(\r\n|\n|\r|\s)/gm, "").trim();
  validateInput();
  
  // calculate the version (size) of the 2D code as a function of the input string length
  const codeVersion = ceil(sqrt(binaryString.length));
  const resolution = round(560 / codeVersion);
  
  // calculate the canvas size, create the canvas and set a background color
  const canvasSize = (codeVersion + border * 2) * resolution;
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  border ? background(255) : background(255, 0, 0);
  
  // draw the 2D code
  for (let i = 0; i < binaryString.length; i++) {
    fill(invertColours 
      ? (binaryString[i] * 255) 
      : (255 - binaryString[i] * 255)
    );
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