import React from 'react';
import './GameOver.css';

function GameOverModal({ onRestart, difficulty, time, isSuccess, playerName, setPlayerName, onSubmitName }) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = () => {
    const trimmedName = playerName.trim(); // Remove whitespace
    const nameToSubmit = trimmedName === '' ? 'Anonymous' : trimmedName; // Use 'Anonymous' if the name is empty
    onSubmitName(nameToSubmit); // Submit the correct name
    onRestart(); // Restart the game after submission
  };
  
  const handleRestart = () => {
    const modal = document.querySelector('.modal-content');
    modal.classList.add('swing'); // Add swing animation
    setTimeout(() => {
      modal.classList.remove('swing');
      modal.classList.add('fall'); // Add fall animation
      setTimeout(() => {
        modal.classList.remove('fall');
        onRestart(); // Restart game after the animation ends
      }, 1000); // Fall animation lasts 1 second
    }, 2000); // Swing animation lasts 2 seconds
  };

  return (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2>{isSuccess ? 'Congratulations!' : 'Game Over'}</h2>
        {isSuccess ? (
          <>
            <p>You successfully completed the Sudoku!</p>
            <p>Difficulty: {difficulty}</p>
            <p>Time Taken: {formatTime(time)}</p>

            {/* Name input field for leaderboard */}
            <label htmlFor="player-name">Enter your name:</label>
            <input
              type="text"
              id="player-name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your Name"
            />
            <button onClick={handleSubmit} className="submit-button">Submit</button>
          </>
        ) : (
          <p>Oops! Looks like the Sudoku gods had other plans. But hey, third time's the charm, right? Give it another go!</p>
        )}
        <button onClick={handleRestart} className="restart-button">Restart</button>
      </div>
    </div>
  );
}

export default GameOverModal;
