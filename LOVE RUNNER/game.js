let road;
let player;
let coins;
let lane = 1;
let lanesX = [120, 180, 240];
let score = 0;
let scoreText;
let loveBar;
let bgMusic;
let started = false;

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

new Phaser.Game(config);

// ================= PRELOAD =================
function preload() {
  this.load.image('road', 'assets/road.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.audio('bgm', 'bgm.mp3');
}

// ================= CREATE =================
function create() {

  // ROAD
  road = this.add.tileSprite(180, 320, 300, 640, 'road');

  // PLAYER (CLEAR & BIG)
  player = this.add.sprite(lanesX[lane], 500, 'player');
  player.setScale(0.6);
  player.setDepth(10);

  // COINS
  coins = this.add.group();

  // UI
  scoreText = this.add.text(20, 20, 'Love: 0 ❤️', {
    fontSize: '18px',
    fill: '#fff'
  });

  this.add.rectangle(180, 55, 200, 12, 0xffffff, 0.3);
  loveBar = this.add.rectangle(80, 55, 0, 12, 0xff4d6d);

  // MUSIC
  bgMusic = this.sound.add('bgm', { loop: true, volume: 0.5 });

  // START SCREEN
  const startText = this.add.text(60, 300,
    'Tap to Start\nRun for My Rasmalai ❤️',
    { fontSize: '22px', fill: '#fff', align: 'center' }
  );

  this.input.once('pointerdown', () => {
    started = true;
    startText.destroy();
    bgMusic.play();

    this.time.addEvent({
      delay: 900,
      callback: spawnCoin,
      callbackScope: this,
      loop: true
    });
  });

  // CONTROLS
  this.input.keyboard.on('keydown-LEFT', () => {
    if (lane > 0) lane--;
  });

  this.input.keyboard.on('keydown-RIGHT', () => {
    if (lane < 2) lane++;
  });
}

// ================= UPDATE =================
function update() {
  if (!started) return;

  // MOVE ROAD
  road.tilePositionY -= 6;

  // MOVE PLAYER TO LANE
  player.x = Phaser.Math.Linear(player.x, lanesX[lane], 0.2);

  // MOVE COINS
  coins.children.iterate(coin => {
    if (!coin) return;

    coin.y += 6;
    coin.scale += 0.002;

    if (coin.y > 700) coin.destroy();

    // COLLISION (simple distance check)
    if (
      Phaser.Math.Distance.Between(
        player.x, player.y,
        coin.x, coin.y
      ) < 40
    ) {
      collectCoin(coin);
    }
  });
}

// ================= FUNCTIONS =================
function spawnCoin() {
  const laneIndex = Phaser.Math.Between(0, 2);
  const coin = coins.create(lanesX[laneIndex], -50, 'coin');
  coin.setScale(0.25);
  coin.setDepth(5);
}

function collectCoin(coin) {
  coin.destroy();
  score++;
  scoreText.setText('Love: ' + score + ' ❤️');

  let width = Math.min(score * 10, 200);
  loveBar.width = width;
}
