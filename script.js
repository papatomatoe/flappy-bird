const canvas = document.querySelector(`#canvas`);
const ctx = canvas.getContext(`2d`);

const BIRD = new Image();
BIRD.src = `img/bird.png`;

const BACKGROUND = new Image();
BACKGROUND.src = `img/bg.png`;

const FOREGROUND = new Image();
FOREGROUND.src = `img/fg.png`;

const PIPE_TOP = new Image();
PIPE_TOP.src = `img/pipeTop.png`;

const PIPE_BOTTOM = new Image();
PIPE_BOTTOM.src = `img/pipeBottom.png`;

const FLY_SOUND = new Audio();
FLY_SOUND.src = `audio/fly.mp3`

const SCORE_SOUND = new Audio();
SCORE_SOUND.src = `audio/score.mp3`;

const BackgroundPosition = {
  X: 0,
  Y: 0
};

const ForegroundPosition = {
  X: 0,
  Y: canvas.height - FOREGROUND.height
};

let BirdPosition = {
  X: 10,
  Y: 150
};

let BIRD_SPEED = 20;
let GRAVITY = 1;
let PIPES_SPEED = 1;
let score = 0;

const GAP = 100;
const POSITION_FOR_NEW_PIPES = 80;
const PIPES_NUM = 3;
const TIMEOUT = 2000;

const TextSettings = {
  COLOR: `#000000`,
  FONT: `24px Arial`,
  X: 10,
  Y: canvas.height - 20
}

const PIPES_POSITIONS = [];

PIPES_POSITIONS[0] = {
  x: canvas.width,
  y: 0
};

const fly = () => {
  BirdPosition.Y -= BIRD_SPEED;
  FLY_SOUND.play();
};

const game = () => {
  ctx.drawImage(BACKGROUND, BackgroundPosition.X, BackgroundPosition.Y);

  for (let i = 0; i < PIPES_POSITIONS.length; i++) {

    ctx.drawImage(PIPE_TOP, PIPES_POSITIONS[i].x, PIPES_POSITIONS[i].y);
    ctx.drawImage(PIPE_BOTTOM, PIPES_POSITIONS[i].x, PIPES_POSITIONS[i].y + PIPE_TOP.height + GAP);
  
    PIPES_POSITIONS[i].x -= PIPES_SPEED;

    if (PIPES_POSITIONS[i].x === POSITION_FOR_NEW_PIPES) {
      PIPES_POSITIONS.push({
        x: canvas.width,
        y: Math.floor(Math.random() * PIPE_TOP.height) - PIPE_TOP.height
      });
    }

    if (PIPES_POSITIONS.length > PIPES_NUM) {
      PIPES_POSITIONS.shift();
    }

    if (BirdPosition.X + BIRD.width >= PIPES_POSITIONS[i].x
      && BirdPosition.X <= PIPES_POSITIONS[i].x + PIPE_TOP.width
      && (BirdPosition.Y <= PIPES_POSITIONS[i].y + PIPE_TOP.height
        || BirdPosition.Y + BIRD.height >= PIPES_POSITIONS[i].y + PIPE_TOP.height + GAP)
        || BirdPosition.Y + BIRD.height >= canvas.height - FOREGROUND.height) {
          BIRD_SPEED = 0;
          GRAVITY = 0;
          PIPES_SPEED = 0;

          document.removeEventListener(`keydown`, fly);

          setTimeout(() => {
            location.reload();
          }, TIMEOUT);
          
        }

        if (PIPES_POSITIONS[i].x === 5) {
          score++;
          SCORE_SOUND.play();
        }
  }


  ctx.drawImage(FOREGROUND, ForegroundPosition.X, ForegroundPosition.Y);
  ctx.drawImage(BIRD, BirdPosition.X, BirdPosition.Y);

  BirdPosition.Y += GRAVITY;

  ctx.fillStyle = TextSettings.COLOR;
  ctx.font = TextSettings.FONT;
  ctx.fillText(`Score: ${score}`, TextSettings.X, TextSettings.Y);

  requestAnimationFrame(game);
};

PIPE_BOTTOM.onload = game;

document.addEventListener(`keydown`, fly)


