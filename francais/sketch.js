// todo = [
//   "add an instant mode, where the answer is accepted as soon as a choice is made"
//   "add black square over warning text when radio button is selected",
//   "allow words to be chosen by CEFR level (A, B, C)",
//   "add limited pratice runs (10, 20, 30 questions, etc)",
//   "add countdown of words remaining in set. progress bar?",
//   "privde a list of missed words for future practice (as an Anki deck?)"
// ];

// features = [
//   "skip questions you're not sure about with the « je ne connais pas ce mot » button or space bar",
//   "get feedback on incorrect answers",
//   "see the translations and explanations for words",
//   "practice an infinite number of times for as long as you want",
//   "keep score of your efforts",
//   "anticheat -- words and their definitions are displayed as images to prevent copy-pasting"
//   "choose your answer with the keyboard and the enter key",
//   "words no longer repeat once they are chosen correctly"
// ];

let submitButton;
let idkButton;
let currentWord;
let score = 0;
let total = 0;
let spectral, spectralItalic, spectralBoldItalic; // spectralBold
let availableDictionaries;
let usedWords = [];

function preload() {
  spectral = loadFont("fonts/Spectral.ttf");
  spectralItalic = loadFont("fonts/Spectral-Italic.ttf");
  spectralBoldItalic = loadFont("fonts/Spectral-BoldItalic.ttf");
  
  // concatenate all dictionaries together
  availableDictionaries = main.concat(géographie);
}

function setup() {
  canvas = createCanvas(windowWidth, 250); // create the canvas on which the words will be displayed
  canvas.parent('canvas-holder'); // force the canvas to be displayed in the correct position on the page
  
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  fill(255);
  
  drawText();
  
  esdButton = document.querySelector('.esd');
  esdButton.addEventListener('click', enSavoirDavantage);
  
  submitButton = document.querySelector('.btn-success');
  submitButton.addEventListener('click', handleResponse);
  
  idkButton = document.querySelector(".btn-fail");
  idkButton.addEventListener('click', handleFail)
  
  document.addEventListener('keydown', handleKeyPress);  
}

function drawText() {
  background('#17181c');
  
  // filter out words that have been correctly guessed
  const availableWords = availableDictionaries.filter(word => !usedWords.includes(word.mot));
  
  // restart if no words left
  if (availableWords.length === 0) {
    usedWords = [];
  }

  currentWord = random(availableWords);
  
  // word text
  textFont(spectral, 64);
  text(currentWord.mot, width/2, 85);

  // meaning text
  textFont(spectralItalic, 32);
  text(currentWord.sig, 0, 150, width);
    
  // scores text
  textFont(spectralBoldItalic, 16);
  text("total", width/3, 5);
  text("correct", width/2, 5);
  text("accuracy", 2*width/3 , 5);
  
  textFont(spectral);
  text(total, width/3, 25);
  text(score, width/2, 25);
  text(`${round(score / total * 100) || 0}%`, 2*width/3, 25);
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
  
  if (userSelection[0] == previousGenre[0]) {
    score++;
    usedWords.push(currentWord.mot); // add word to dictionary filter to prevent it from being chosen again
    selectedRadio.parentElement.style.backgroundColor = 'hsl(123, 90%, 10%)';
    selectedRadio.parentElement.style.boxShadow = '0 0 0 2px hsl(123, 90%, 40%) inset';
  } else {
    selectedRadio.parentElement.style.backgroundColor = 'hsl(0, 90%, 10%)';
    selectedRadio.parentElement.style.boxShadow = '0 0 0 2px hsl(0, 90%, 40%) inset';
  }
  total++;
    
  setTimeout(function() {
    selectedRadio.parentElement.style.backgroundColor = '';
    selectedRadio.parentElement.style.boxShadow = '';
    drawText();
    if (userSelection[0] !== previousGenre[0]) {
      text(`Oups, that's not quite right. The gender of « ${previousMot} » is ${previousGenre}.`, width / 2, height - 15);
      return
    }
  }, 500); // display a new word (along with any warning messages) after a 0.5s delay
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
    
// redirect user to dictionary
function enSavoirDavantage(e) {
  e.preventDefault();
  // window.open("https://www.larousse.fr/dictionnaires/francais/" + currentWord.mot, '_blank').focus();
  window.open("https://www.wordreference.com/fren/" + currentWord.mot, '_blank').focus();
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