import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEraser, faPencilAlt, faLightbulb, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import './Controls.css';

function Controls({ onNumberSelect, resetSudoku, onUndo, toggleNotesMode, handleErase, handleHint, isNotesMode, eraseMode, hintCount, mistakeCount, time, handlePause, isPaused }) {
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="controls">
      {/* Display timer */}
      <div className="status">
        <span>Mistakes: {mistakeCount}/3</span>
        <span className='time'>Time: {formatTime(time)}
        {/* Add Pause/Resume button */}
        <button className="pause-btn" onClick={handlePause}>
          <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
        </button></span>
      </div>

      {/* Action buttons */}
      <div className="actions">
        <button className="action-btn" onClick={onUndo}>
          <FontAwesomeIcon icon={faUndo} />
          <span>Undo</span>
        </button>
        <button
          className={`action-btn ${eraseMode ? 'erase-on' : ''}`}
          onClick={handleErase}
        >
          <FontAwesomeIcon icon={faEraser} />
          <span>Erase</span>
        </button>
        <button
          className={`action-btn ${isNotesMode ? 'notes-on' : ''}`}
          onClick={toggleNotesMode}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
          <span>Notes</span>
        </button>
        <button className="action-btn" onClick={handleHint}>
          <FontAwesomeIcon icon={faLightbulb} />
          <span>Hint</span>
          <span className="hint-count">{hintCount}</span>
        </button>
      </div>

      {/* Number select buttons */}
      <div className="number-select">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button key={number} onClick={() => onNumberSelect(number)} className="number-btn">{number}</button>
        ))}
      </div>
      <button onClick={resetSudoku} className="new-game">New Game</button>
    </div>
  );
}

export default Controls;
