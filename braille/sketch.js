// add ability to choose between braille grades
// add capital letter mark, then remove .toLowerCase() so that capital letters can be tested
// make sure all numbers are preceeded by a number mark
// have a green check appear if guess is correct, red cross if not
// add correct guesses counter
// add way to track which sentences have been given and do not repeat them until exhaustion

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
let long = [
  "The crooked, cobblestone street wound its way through the heart of the old town, its uneven surface a testament to centuries of footsteps. Worn shop signs creaked in the salty breeze, their faded paint hinting at the vibrant past of the once-thriving port.",
  "Laughter spilled out from a brightly lit tavern door, momentarily breaking the peaceful rhythm of the lapping waves against the weathered docks. As dusk settled, casting long shadows across the square, a lone figure emerged from the labyrinth of alleys, their face obscured by the deepening twilight.",
  "Despite the scorching desert sun beating down mercilessly, the determined archaeologist pressed on, her boots crunching on the ancient sand. Each step felt heavy with the weight of history, the vast expanse of dunes whispering secrets of forgotten civilizations.",
  "In the distance, a jagged line of eroded cliffs shimmered in the heat haze, promising a potential resting place and perhaps, a hidden doorway to a long-lost tomb. A sudden gust of wind whipped sand into her face, momentarily blurring her vision, but she refused to falter, driven by an insatiable curiosity and the thrill of discovery.",
  "Nestled amongst the towering redwoods, a sense of serenity permeated the air, broken only by the gentle chirping of unseen birds. Sunlight filtered through the dense canopy, casting dappled patterns on the mossy forest floor.",
  "A winding path, carpeted with fallen leaves, beckoned exploration, promising hidden waterfalls and ancient, gnarled trees that seemed to stand guard over the timeless beauty of the wilderness. With each inhaled breath, the fresh, pine-scented air invigorated the soul, offering a welcome escape from the hustle and bustle of everyday life.",
  "The aroma of freshly baked bread hung heavy in the air, wafting from the bustling bakery across the street. Tourists marveled at the intricate architecture of the medieval cathedral, its weathered gargoyles casting watchful gazes upon the cobblestone square below.",
  "A group of artists set up their easels, capturing the vibrant energy of the scene in quick brushstrokes. As the clock tower chimed midday, a flock of pigeons fluttered overhead, their cooing adding to the symphony of everyday sounds in the heart of the ancient city.",
  "Beneath the shimmering surface of the lake, a world of breathtaking beauty unfolded. Sunlight streamed through crystal-clear water, illuminating vibrant coral reefs teeming with colorful fish.",
  "Schools of silver minnows darted between swaying aquatic plants, while a lone, graceful seahorse clung to a rocky outcrop. In the distance, a shadowy shape emerged from the depths, its sleek form gliding effortlessly through the water. It was a moment frozen in time, a glimpse into the vibrant ecosystem hidden beneath the placid surface.",
  "The weight of countless stories seemed to press down from the dusty shelves of the antique bookstore. Worn leather spines whispered tales of adventure and romance, while weathered maps hinted at journeys to faraway lands. A faint scent of old paper mingled with the musty aroma of time, creating an atmosphere of forgotten memories and whispered secrets.",
  "As a lone customer wandered the labyrinthine aisles, their fingertips tracing the embossed lettering of a first edition, one couldn't help but feel transported to another era, a time when the written word held a power beyond measure."
];
let message;
let correct;
let inputBox;
let brailleNormal;
let indicator;
let difficultySlider;
let setButton;

function preload() {
  brailleNormal = loadFont("fonts/braille.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  difficultySlider = createSlider(1, 3, 2);
  difficultySlider.position(20, 10);
  difficultySlider.size(150);
  difficultySlider.input(showSentence)
  
  inputBox = createInput();
  inputBox.size((width * 2) / 3);
  inputBox.position((width - inputBox.width) / 2, height - 100);
  inputBox.show();
  
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  
  showSentence();
}

// no need for draw function as all input and reloading is done on keypress
// function draw() {}

function keyPressed() {
  checkInput();
}

function showBadge(state) {
  background(0);
  textSize(32);
  textFont("Arial");
  fill(state ? "green" : "red");
  indicator = text(
    state ? "correct" : "incorrect, try again",
    width / 2,
    inputBox.y - textSize()
  );
}

function checkInput() {
  if (keyCode == ENTER) {
    correct = inputBox.value().toLowerCase() === message.toLowerCase();
    if (correct) {
      chooseMessage();
      inputBox.value('');
    }
    showBadge(correct);
    textSize(difficultySlider.value() == 3 ? 64 : 96);
    textFont(brailleNormal);
    fill(255);
    text(message, width / 6, 0, (width * 2) / 3, height - 128);
  }
}

function chooseMessage() {
  let difficulty = difficultySlider.value();
  if (difficulty === 1) {
    message = random(easy);
  } else if (difficulty === 2) {
    message = random(hard);
  } else {
    message = random(long);
  }
}

function showSentence() {
  background(0);
  textSize(difficultySlider.value() == 3 ? 64 : 96);
  textFont(brailleNormal);
  chooseMessage();
  fill(255);
  text(message, width / 6, 0, (width * 2) / 3, height - 128);
}