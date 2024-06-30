// todo = [
//   "add positive feedback indicators (visual, audible)",
//   "add an instant mode, where the answer is accepted as soon as a choice is made"
//   "prevent words from being reselected if correct answer given",
//   "add black square over warning text when radio button is selected",
//   "allow words to be chosen by CEFR level (A, B, C)",
//   "add limited pratice run (10, 20, 30 questions, etc)",
//   "add countdown of words remaining in set. progress bar?"
// ];

// features = [
//   "skip questions you're not sure about with the « je ne connais pas ce mot » button or space bar",
//   "get feedback on incorrect answers",
//   "see the translations and explanations for words",
//   "practice an infinite number of times for as long as you want",
//   "keep score of your efforts",
//   "anticheat -- words and their definitions are displayed as images to prevent copy-pasting"
//   "choose your answer with the keyboard and the enter key"
// ];

const bWords = [{}];
const cWords = [{}];
let submitButton;
let idkButton;
let currentWord;
let score = 0;
let total = 0;
let spectral, spectralItalic, spectralBoldItalic; // spectralBold

function preload() {
  spectral = loadFont("fonts/Spectral.ttf");
  spectralItalic = loadFont("fonts/Spectral-Italic.ttf");
  spectralBoldItalic = loadFont("fonts/Spectral-BoldItalic.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, 250); // create the canvas on which the words will be displayed
  canvas.parent('canvas-holder'); // force the canvas to be displayed in the correct position on the page
  
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  fill(255);
  
  drawText();
  
  submitButton = document.querySelector('.btn-success');
  submitButton.addEventListener('click', handleResponse);
  
  idkButton = document.querySelector(".btn-fail");
  idkButton.addEventListener('click', handleFail)
  
  document.addEventListener('keydown', handleKeyPress);
  
  // frameRate(1);
  noLoop(); // prevent the code from running every frame
}

function drawText() {
  background('#17181c');
  currentWord = random(pickWordBank());
  
  textFont(spectral, 64);
  text(currentWord.mot, width/2, 85);

  textFont(spectralItalic, 32);
  text(currentWord.sig, 3*width/16, 150, 5*width/8);

  textFont(spectralBoldItalic, 16);
  text("total", width/3, 5);
  text("correct", width/2, 5);
  text("accuracy", 2*width/3 , 5);
  
  textFont(spectral);
  text(total, width/3, 25);
  text(score, width/2, 25);
  text(`${round(score / total * 100) || 0}%`, 2*width/3, 25);
}

function pickWordBank() {
  return aWords
}

// if an answer is chosen
function handleResponse(e) {
  e.preventDefault();
  const selectedRadio = document.querySelector('input[name="réponses"]:checked');
  
  if (!selectedRadio) { // if no radio button selected, warn and do not continue
    text(`↓ Uh oh, it looks like you forgot to select a gender! ↓`, width / 2, height - 35);
    return
  }
    
  userSelection = selectedRadio.parentElement.textContent.trim(); // get selected gender
  selectedRadio.checked = false; // uncheck radio button
  let previousMot = currentWord.mot;
  let previousGenre = currentWord.genre;
  
  if (userSelection[0] == previousGenre[0]) { score++; }
  total++;
    
  drawText(); //currentWord = pickWord(); // display a new word
  
  if (userSelection[0] !== previousGenre[0]) {
    text(`Oups, that's not quite right. The gender of « ${previousMot} » is ${previousGenre}.`, width / 2, height - 15);
    return
  }
}

// if word is skipped
function handleFail(e) {
  e.preventDefault();
  try { document.querySelector('input[name="réponses"]:checked').checked = false; } catch {}
  
  let previousMot = currentWord.mot;
  let previousGenre = currentWord.genre;
  
  drawText(); //currentWord = pickWord();
  
  text(`No worries, let's skip this quesion. For future reference, the gender of « ${previousMot} » is ${previousGenre}.`, width / 2, height - 15);
}

// allow user to choose option with keyboard
function handleKeyPress(e) {
  e.preventDefault();
  const key = e.key.toLowerCase();
  if (key === 'm' || key === '1' || key === 'f' || key === '2') {
    const radios = document.querySelectorAll('input[name="réponses"]');
    const selectedRadio = key === 'm' || key === '1' ? radios[0] : radios[1]; // Select based on key
    selectedRadio.checked = true;
  } else if (key === 'enter') {
    submitButton.click(); // simulate submit button click on Enter
  } else if (key === 'escape') {
    closeInstructionsPopup();  // call function to close popup
  } else if (key === ' ') {
    idkButton.click();
  }
}