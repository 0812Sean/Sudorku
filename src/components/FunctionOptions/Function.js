import React, { useState } from 'react';
import './Function.css'; 

const backgroundImages = [
  null, 
  '/h1.png',
  '/h2.png',
  '/h3.png',
  '/h4.png',
  '/h5.png',
  '/h6.png',
  '/h7.png',
  '/h8.png',
  '/h9.png',
  '/h10.png',
  '/h11.png',
  '/h12.png',
  '/h13.png',
];

const Function1Options = ({ onConfirm, onClose }) => {
  const [selectedBackground, setSelectedBackground] = useState(null); // Stores the selected background image

  const handleOptionClick = (index) => {
    setSelectedBackground(backgroundImages[index]); // Sets background image on click
  };

  return (
    <div className="function1-options-overlay">
      <div className="function1-options">
        <div className="background-preview">
          {selectedBackground !== null ? (
            <img src={selectedBackground} alt="Selected Background" className="preview-image" />
          ) : (
            <p>No selection</p> // Display message if "None" is selected
          )}
        </div>
        <div className="options-container">
          {backgroundImages.map((image, index) => (
            <button
              key={index}
              className={`option-button ${selectedBackground === image ? 'selected' : ''}`}
              onClick={() => handleOptionClick(index)}
              style={image ? { backgroundImage: `url(${image})` } : {}} // If background image exists, set as button background
            >
              {image === null ? 'None' : ``} {/* If image is null, display "None" text */}
            </button>
          ))}
        </div>
        <div className="confirmation-buttons">
          <button className="confirm-button" onClick={() => onConfirm(selectedBackground)}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Function1Options;
