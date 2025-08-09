import Phaser from 'phaser';

export default class RunnerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RunnerScene' });
    this.score = 0;
    this.speed = 300; // starting speed for obstacles and ground movement
    this.startedAt = 0;
  }

  preload() {
    // Load sprites and audio assets
    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('dino', 'assets/dino_run.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.image('cactus', 'assets/cactus.png');
    this.load.audio('jumpSound', ['assets/jump.mp3']);
    this.load.audio('crashSound', ['assets/ha-gayyy.mp3']);
  }

  create(data) {
    this.mode = data.mode;
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);

    // Create repeating ground tiles
    this.groundGroup = this.add.group();
    for (let i = 0; i < 3; i++) {
      const ground = this.physics.add
        .staticImage(i * 800, 580, 'ground')
        .setOrigin(0, 0);
      this.groundGroup.add(ground);
    }

    // Create the player (dinosaur)
    this.player = this.physics.add.sprite(150, 520, 'dino');
    this.player.setCollideWorldBounds(true);
    this.player.body
      .setSize(30, 48) // hit box size
      .setOffset(9, 0);

    // Animation for running
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('dino', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    this.player.play('run');

    // Group for obstacles and start spawning
    this.obstacles = this.physics.add.group();
    this.time.delayedCall(1000, this.spawnObstacle, [], this);

    // Collision detection
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.gameOver,
      null,
      this
    );

    // Input: pointer and space key for jumping
    this.input.on('pointerdown', this.jump, this);
    this.input.keyboard.on('keydown-SPACE', this.jump, this);

    // Score text display
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      fill: '#FFF'
    });

    this.startedAt = this.time.now;

    // Speed increases: after 20 seconds, then every 15 seconds
    this.time.delayedCall(20000, () => {
      this.time.addEvent({
        delay: 15000,
        callback: () => {
          this.speed *= 1.1;
        },
        loop: true
      });
    });
  }

  jump() {
    // Only jump if touching the ground
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-550);
      this.sound.play('jumpSound');
    }
  }

  spawnObstacle() {
    // Spawn a cactus off the right side of the screen
    const x = this.cameras.main.scrollX + 900;
    const cactus = this.obstacles.create(x, 540, 'cactus');
    cactus.setVelocityX(-this.speed);
    cactus.setImmovable(true);
    cactus.body.allowGravity = false;
    cactus.setDepth(1);

    // Automatically remove once off screen
    cactus.checkWorldBounds = true;
    cactus.outOfBoundsKill = true;

    // Schedule the next obstacle with a random delay
    const delay = Phaser.Math.Between(800, 1600);
    this.time.delayedCall(delay, this.spawnObstacle, [], this);
  }

  update(time, delta) {
    // Move the ground tiles
    this.groundGroup.children.iterate((ground) => {
      ground.x -= this.speed * (delta / 1000);
      if (ground.x + ground.width < this.cameras.main.scrollX) {
        ground.x += ground.width * this.groundGroup.getLength();
      }
    });

    // Scroll the camera to simulate forward motion
    this.cameras.main.scrollX += this.speed * (delta / 1000);

    // Update the score based on elapsed time
    this.score = Math.floor((time - this.startedAt) / 100);
    this.scoreText.setText('Score: ' + this.score);
  }

  gameOver(player, obstacle) {
    // Play crash sound, pause physics, and transition to Game Over scene
    this.sound.play('crashSound');
    this.physics.pause();
    this.scene.start('GameOverScene', { score: this.score });
  }
}
