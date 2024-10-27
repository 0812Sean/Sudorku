import React, { useEffect, useRef } from 'react';
import './InstructionsModal.css';

function InstructionsModal({ onClose }) {
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="instructions-modal">
      <div className="modal-content" ref={modalRef}>
        <h2>Game Instructions</h2>
        <p>
          Welcome to the world of Sudoku, where numbers live in harmony... or at least they try! 
          Your mission, should you choose to accept it, is to fill this 9x9 grid with numbers. 
          Sounds easy, right? Well, there's a twist – no number can repeat in a row, column, or 3x3 box. 
          It's like organizing a party where everyone must sit in their assigned seat... forever.
        </p>
        <p>
          Choose your difficulty level wisely. Hints are like gold here – rare, precious, 
          and usually followed by the thought, "Why didn’t I think of that?"
        </p>
        <p>
          Use "notes mode" to jot down possibilities like a Sudoku detective, 
          and if things go wrong, there's always the trusty erase mode to make it seem like you knew the right answer all along.
        </p>
        <p>
          Good luck! You’re going to need it. And remember: it’s not about how quickly you finish the puzzle, 
          but how calmly you avoid throwing your device out the window.
        </p>
        <button className="close-button" onClick={onClose}>Got it! Let's play!</button>
      </div>
    </div>
  );
}

export default InstructionsModal;
