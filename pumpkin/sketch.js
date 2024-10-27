let objects = [];
let score = 0;
let spawnInterval = 300;
let lastSpawnTime = 0;
let pumpkinImage;
let skullImage;
let backgroundImage;
let gameTime = 60;
let gameOver = false;
const endMessage = 'Spooooktacular!';
let creepySound, matchSound, winSound;

function preload() {
  pumpkinImage = loadImage('pumpkin.png');
  skullImage = loadImage('skull.png');
  backgroundImage = loadImage('bg.png');
  creepySound = loadSound('creepy.mp3');
  matchSound = loadSound('match.wav');
  winSound = loadSound('victory.wav');
}

function setup() {
  createCanvas(650 * 3 - 150, 1080 - 180);
  setInterval(() => {
    if (gameTime > 0 && !gameOver) {
      gameTime--;
    } else if (gameTime <= 0) {
      gameOver = true;
    }
  }, 1000);

  creepySound.play();
}

function draw() {
  background(backgroundImage);

  fill(255);
  textSize(32);
  text(`Score: ${score}`, 10, 40);

  textAlign(RIGHT);
  text(`Time: ${gameTime}s`, width - 10, 40);
  textAlign(LEFT);

  if (gameOver) {
    textSize(64);
    fill(100, 255, 255);
    textAlign(CENTER);
    textStyle(BOLD);
    text(endMessage, width / 2, height / 2);
    textAlign(LEFT);
    noLoop();
    creepySound.stop();
    winSound.play();
    return;
  }

  if (millis() - lastSpawnTime > spawnInterval) {
    objects.push(new FallingObject());
    spawnInterval = random(200, 700);
    lastSpawnTime = millis();
  }

  for (let i = objects.length - 1; i >= 0; i--) {
    objects[i].update();
    objects[i].display();

    if (objects[i].y > height) {
      objects.splice(i, 1);
    }
  }
}

function mousePressed() {

  if (!gameOver) {
    for (let i = objects.length - 1; i >= 0; i--) {
      let obj = objects[i];
      let d = dist(mouseX, mouseY, obj.x + obj.size / 2, obj.y + obj.size / 2);

      if (d < obj.size / 2) {
        if (obj.isPumpkin) {
          score++;
          matchSound.play();
        } else {
          score--;
        }

        objects.splice(i, 1);
        break;
      }
    }
  }
}

class FallingObject {
  constructor() {
    this.isPumpkin = random() < 0.6;
    this.size = random(50, 220);
    this.x = random(this.size, width - this.size);
    this.y = -300;
    this.speed = random(5, 8);
  }

  update() {
    this.y += this.speed;
  }

  display() {

    if (this.isPumpkin) {
      image(pumpkinImage, this.x, this.y, this.size, this.size);
    } else {
      image(skullImage, this.x, this.y, this.size, this.size);
    }
  }
}