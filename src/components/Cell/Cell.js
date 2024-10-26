import React from 'react';
import './Cell.css';

function Cell({ value, notes, onClick, isSelected, isSameValue, isInSameGroup, isFlashing, isError, isWave }) {
  let className = "cell";

  if (isSelected) {
    className += " selected";  // Highlight the selected cell
  } else if (isSameValue) {
    className += " same-value";  // Highlight cells with the same value
  } else if (isInSameGroup) {
    className += " same-group";  // Highlight cells in the same group (row, column, or box)
  }

  if (isFlashing) {
    className += " flashing";  // Add the flashing class
  }

  if (isError) {
    className += " error";  // Add error class if the input is incorrect
  }

  if (isWave) {
    className += " wave";  // Add wave class for wave animation
  }

  return (
    <div className={className} onClick={onClick}>
      {value ? (
        <span className="cell-value">{value}</span>
      ) : (
        <div className="cell-notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <span key={num} className={`note note-${num} ${notes.includes(num) ? "visible" : ""}`}>
              {notes.includes(num) ? num : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cell;
