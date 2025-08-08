import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data) {
    // Semi-transparent dark overlay
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6
    );

    // Game over message
    this.add
      .text(this.scale.width / 2, this.scale.height * 0.3, 'HA! GAYYYY!', {
        fontSize: '48px',
        fill: '#FF4081'
      })
      .setOrigin(0.5);

    // Display the final score
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height * 0.45,
        `Score: ${data.score}`,
        {
          fontSize: '32px',
          fill: '#FFF'
        }
      )
      .setOrigin(0.5);

    // Play Again button
    const playAgain = this.add
      .text(this.scale.width / 2, this.scale.height * 0.6, 'Play Again', {
        fontSize: '28px',
        fill: '#00FFFF'
      })
      .setOrigin(0.5)
      .setInteractive();

    playAgain.on('pointerdown', () => {
      // Reset the speed and restart the main runner scene
      const runner = this.scene.get('RunnerScene');
      runner.speed = 300;
      this.scene.start('RunnerScene', { mode: 'free' });
    });
  }
}
