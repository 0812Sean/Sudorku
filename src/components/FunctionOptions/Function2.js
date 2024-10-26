import React, { useState, useEffect } from 'react';
import './Function2.css'; 

const appBackgroundImages = [
    null, 
    '/b1.png',
    '/b2.png',
    '/b3.png',
    '/b4.png',
    '/b5.png',
    '/b6.png',
    '/b7.png',
    '/b8.png',
    '/b9.png',
    '/b10.png',
    '/b11.png',
    '/b12.png',
    '/b13.png',
    '/b14.png',
    '/b15.png',
    '/b16.png',
];


const Function2Options = ({ onConfirm, onClose }) => {
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [isBackgroundTransparent, setIsBackgroundTransparent] = useState(true);

  // Toggle background color (white or transparent)
  const toggleBackground = () => {
    const newIsTransparent = !isBackgroundTransparent;
    setIsBackgroundTransparent(newIsTransparent);
  
    const cellBackground = newIsTransparent ? 'transparent' : 'white';
    localStorage.setItem('cellBackgroundColor', cellBackground);
    document.documentElement.style.setProperty('--cell-background-color', cellBackground);
  };
  

  // Handle background selection
  const handleOptionClick = (index) => {
    setSelectedBackground(appBackgroundImages[index]);
  };

  // Load the initial background color state on component mount
  useEffect(() => {
    const savedBackgroundColor = localStorage.getItem('cellBackgroundColor') || 'transparent';
    setIsBackgroundTransparent(savedBackgroundColor === 'transparent');
    document.documentElement.style.setProperty('--cell-background-color', savedBackgroundColor);
  }, []);
  

  return (
    <div className="function1-options-overlay">
      <div className="function1-options">
        <div className="background-preview">
          {selectedBackground !== null ? (
            <img src={selectedBackground} alt="Selected Background" className="preview-image" />
          ) : (
            <p>No background selected</p>
          )}
        </div>

        {/* Background color switch */}
        <div className="switch-container">
          <label className="switch">
            <input type="checkbox" checked={isBackgroundTransparent} onChange={toggleBackground} />
            <span className="slider"></span>
          </label>
          <span>{isBackgroundTransparent ? 'Transparent' : 'White'}</span>
        </div>

        {/* Background image options */}
        <div className="options-container">
          {appBackgroundImages.map((image, index) => (
            <button
              key={index}
              className={`option-button ${selectedBackground === image ? 'selected' : ''}`}
              onClick={() => handleOptionClick(index)}
            >
              {image === null ? 'None' : <img src={image} alt={`Background ${index}`} className="background-image" />}
            </button>
          ))}
        </div>

        {/* Confirmation buttons */}
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

export default Function2Options;
