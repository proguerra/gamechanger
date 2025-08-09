import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    // Load images for the background and buttons
    this.load.image('background', 'assets/background.png');
    this.load.image('freeBtn', 'assets/freeButton.png');
    this.load.image('paidBtn', 'assets/paidButton.png');
  }

  create() {
    // Add a centred background image
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, 'background')
      .setOrigin(0.5)
      .setDepth(0);

    // Title text at the top
    this.add
      .text(this.scale.width / 2, this.scale.height * 0.2, 'Futuristic Dino Run', {
        fontSize: '40px',
        fill: '#00FFCC'
      })
      .setOrigin(0.5);

    // Display best score from previous runs if available
    const bestScore = localStorage.getItem('bestScore') || 0;
    this.add
      .text(this.scale.width / 2, this.scale.height * 0.35, `Best: ${bestScore}`, {
        fontSize: '24px',
        fill: '#FFF'
      })
      .setOrigin(0.5);

    // Free Play button
    const free = this.add
      .image(this.scale.width / 2, this.scale.height * 0.5, 'freeBtn')
      .setInteractive();
    free.on('pointerdown', () => {
      // Start the main game in “free” mode
      this.scene.start('RunnerScene', { mode: 'free' });
    });

    // Paid Play button
    const paid = this.add
      .image(this.scale.width / 2, this.scale.height * 0.65, 'paidBtn')
      .setInteractive();
    paid.on('pointerdown', () => {
      // Start the main game in “paid” mode
      this.scene.start('RunnerScene', { mode: 'paid' });
    });
  }
}
