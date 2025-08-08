import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

import StartScene from './scenes/StartScene';
import RunnerScene from './scenes/RunnerScene';
import GameOverScene from './scenes/GameOverScene';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    // Only create the game once
    let game;
    if (!game) {
      const config = {
        type: Phaser.AUTO,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 1000 },
            debug: false
          }
        },
        scale: {
          parent: gameRef.current,
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 800,
          height: 600
        },
        scene: [StartScene, RunnerScene, GameOverScene]
      };
      game = new Phaser.Game(config);
    }
    return () => {
      // destroy game on unmount to prevent duplicate canvases
      if (game) game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameRef}
      id="game-container"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default Game;

