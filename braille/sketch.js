// add ability to choose between braille grades
// add capital letter mark, then remove .toLowerCase() so that capital letters can be tested
// make sure all numbers are preceeded by a number mark
// have a green check appear if guess is correct, red cross if not. do not change bg color.
// add correct guesses counter
// add way to track which sentences have been given and do not repeat them until exhaustion
// add also short and long sentences and increase the length of the sentence as the session continues

let easy = [
  "I see a cat.",
  "The dog is red.",
  "We go to school.",
  "You eat an apple.",
  "He plays with a ball.",
  "She likes to jump.",
  "It is a hot day.",
  "We have fun.",
  "The book is open.",
  "The door is closed.",
  "The big brown dog barks.",
  "The small white cat sleeps.",
  "The yellow bird sings.",
  "The red car drives fast.",
  "The green grass is soft.",
  "The blue sky is clear.",
  "The sweet cake is delicious.",
  "The cold water is refreshing.",
  "The tall tree has leaves.",
  "The round ball bounces.",
  "Where is the ball?",
  "What is your name?",
  "Who is playing?",
  "When do we eat?",
  "Why are you sad?",
  "How do you feel?",
  "Can you see the cat?",
  "Do you like to read?",
  "Will you help me?",
  "Are you ready?",
  "I run and jump.",
  "We climb the tree.",
  "You write your name.",
  "He opens the door.",
  "She closes the book.",
  "It rains outside.",
  "We sing a song.",
  "You play a game.",
  "He eats an apple.",
  "She drinks milk.",
  "The boy throws the ball to his friend.",
  "The girl reads a book in the library.",
  "We play games after school.",
  "They eat dinner with their family.",
  "The teacher writes on the board.",
  "The doctor helps sick people.",
  "The musician plays the piano.",
  "The firefighter puts out fires.",
  "The baker makes delicious bread.",
  "The artist paints beautiful pictures.",
  "There is one apple.",
  "I see two birds.",
  "We have three books.",
  "You eat four cookies.",
  "He has five pencils.",
  "She sees six dogs.",
  "She reads ten pages.",
  "There are seven days in a week.",
  "We have eight hours of sleep.",
  "You play nine games.",
  "Hello! How are you?",
  "Good morning. Have a nice day.",
  "Thank you for your help.",
  "Please give me the ball.",
  "It's cold outside!",
  "Wow!",
];
let hard = [
  "Hey! How's your day going?",
  "Wow, your garden looks beautiful! Those roses are blooming nicely.",
  "Excuse me, do you know what time the bus arrives?",
  "Thanks for holding the door for me!",
  "I think I left my phone at the coffee shop. Maybe they'll have it behind the counter.",
  "This movie is hilarious! I can't remember the last time I laughed this hard.",
  "I need to get some groceries this weekend. We're almost out of everything.",
  "Should we order takeout tonight, or cook something at home?",
  "I'm going to take a quick shower before bed. I'm exhausted.",
  "Can you set the alarm for 7 am tomorrow? I have an early meeting.",
  "Good morning! Did you sleep well?",
  "Did you remember to pack your swimsuit for the pool party today?",
  "This traffic is never-ending! I swear it takes an hour to get anywhere in this city.",
  "Hey team, just wanted to give a quick update on the project.",
  "I think I finally figured out this new software. It's actually pretty user-friendly.",
  "Anyone up for coffee after this meeting? My brain needs a jumpstart.",
  "I can't believe it's already Friday! This week flew by.",
  "What are your plans for the weekend? Anything exciting?",
  "Ugh, I think I'm coming down with a cold. Just what I need.",
  "Can you make sure the kids brush their teeth before bed?",
];
let message;
let userInput;
let inputBox;
let brailleNormal;
let indicator;

function preload() {
  brailleNormal = loadFont("fonts/braille.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  textSize(96);
  textFont(brailleNormal);
  message = random(hard);
  fill(255);
  text(message, width / 6, 0, (width * 2) / 3, height - 128);
  inputBox = createInput();
  inputBox.size((width * 2) / 3);
  inputBox.position((width - inputBox.width) / 2, height - 100);
  inputBox.show();
}

// no need for draw function as all input and reloading is done on keypresses
// function draw() {}

function keyPressed() {
  checkInput(key);
}

function showBadge(state = true) {
  background(0);
  textFont("Arial");
  textSize(32);
  fill(state ? "green" : "red");
  indicator = text(
    state ? "correct" : "incorrect, try again",
    width / 2,
    inputBox.y - textSize()
  );
}

function checkInput(k) {
  if (keyCode == ENTER) {
    userInput = inputBox.value();
    if (userInput.toLowerCase() === message.toLowerCase()) {
      showBadge();
      message = random(hard);
    } else {
      showBadge(false);
    }
    textSize(96);
    textFont(brailleNormal);
    fill(255);
    text(message, width / 6, 0, (width * 2) / 3, height - 128);
    inputBox.value("");
  }
}