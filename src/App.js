import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls/Controls';
import GameOverModal from './components/GameOver/GameOver';
import Sidebar from './components/Sidebar/Sidebar';
import Function1Options from './components/FunctionOptions/Function';
import Function2Options from './components/FunctionOptions/Function2';
import InstructionsModal from './components/InstructionsModal/InstructionsModal'; // Import the modal
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'; 
import { db } from './firebase'; 
import './index.css';

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Helper function to check if placing num at grid[row][col] is valid
const isSafe = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

// Recursive backtracking solver to fill the grid
const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate a fully solved valid Sudoku board with the first row randomized
const generateFullSolution = () => {
  const grid = Array(9).fill(null).map(() => Array(9).fill(null));

  // Randomize the first row with numbers 1 to 9
  const firstRow = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  grid[0] = firstRow;

  // Solve the rest of the grid
  solveSudoku(grid);
  return grid;
};

// Remove numbers to create the puzzle
const createPuzzleFromSolution = (solution, numRemove = 40) => {
  const puzzle = solution.map(row => row.map(value => ({ value, notes: [], isEditable: false })));

  let count = numRemove;
  while (count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col].value !== null) {
      puzzle[row][col].value = null;
      puzzle[row][col].isEditable = true;
      count--;
    }
  }

  return puzzle;
};

function App() {
  const [playerName, setPlayerName] = useState(''); 
  const [solution, setSolution] = useState(generateFullSolution());
  const [difficulty, setDifficulty] = useState('Easy');
  const [previousDifficulty, setPreviousDifficulty] = useState('Easy'); // To store the previous difficulty
  const [sudoku, setSudoku] = useState(createPuzzleFromSolution(solution, 40));
  const [history, setHistory] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [eraseMode, setEraseMode] = useState(false);
  const [hintCount, setHintCount] = useState(3);
  const [flashingCell, setFlashingCell] = useState(null);
  const [showNoHintMessage, setShowNoHintMessage] = useState(false);
  const [waveCells, setWaveCells] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customEmptyCells, setCustomEmptyCells] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track success
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [sudokuVisible, setSudokuVisible] = useState(true); // To control visibility
  const [isFunction1Active, setIsFunction1Active] = useState(false); 
  const [isFunction2Active, setIsFunction2Active] = useState(false); 
  const [isGameStarted, setIsGameStarted] = useState(false); // New state to track if the game has started
  const [showLeaderboard, setShowLeaderboard] = useState(false); // Show leaderboard state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false); 
  const [showMistakeAdModal, setShowMistakeAdModal] = useState(false);
  const [showAdComponent, setShowAdComponent] = useState(false);
  const [leaderboard, setLeaderboard] = useState({
    Easy: [],
    Medium: [],
    Hard: [],
    VeryHard: [],
    Extreme: [],
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2216607554928934';
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script); 
    };
  }, []);
  
  const AdComponent = () => {
    useEffect(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }, []);
  
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", pointerEvents: "auto" }}
          data-ad-client="ca-pub-2216607554928934" 
          data-ad-slot="6556732735"   
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  };
   
  // useEffect(() => {
    const fetchLeaderboard = async () => {
      const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme'];
      const updatedLeaderboard = {};
      
      for (const level of difficulties) {
        const leaderboardRef = collection(db, `leaderboard-${level}`);
        const q = query(leaderboardRef, orderBy('time', 'asc'));
        const leaderboardSnapshot = await getDocs(q);
        updatedLeaderboard[level] = leaderboardSnapshot.docs.map(doc => doc.data());
      }
      
      setLeaderboard(updatedLeaderboard);
    };

    fetchLeaderboard();
  // }, []);

  useEffect(() => {
    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
      document.documentElement.style.setProperty('--selected-background', `url(${savedBackground})`);
    }
  
    const savedAppBackground = localStorage.getItem('appBackground');
    if (savedAppBackground) {
      document.documentElement.style.setProperty('--app-background', `url(${savedAppBackground})`);
    }
  
    const savedCellBackgroundColor = localStorage.getItem('cellBackgroundColor') || 'transparent';
    console.log('Applying saved cell background color:', savedCellBackgroundColor);
    document.documentElement.style.setProperty('--cell-background-color', savedCellBackgroundColor); 
  
  }, []);
  
  const handleFunction4Click = () => {
    setShowInstructions(true); // Show instructions modal
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false); // Close instructions modal
  };
  useEffect(() => {
    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
      document.documentElement.style.setProperty('--selected-background', `url(${savedBackground})`);
    }

    const savedAppBackground = localStorage.getItem('appBackground');
    if (savedAppBackground) {
      document.documentElement.style.setProperty('--app-background', `url(${savedAppBackground})`);
    }
    
    // Check if a game was already started and automatically start the timer
    const gameStarted = localStorage.getItem('isGameStarted');
    if (gameStarted) {
      setIsGameStarted(true);
    }
    
  }, []);

  useEffect(() => {
    // Store the game started state in localStorage
    localStorage.setItem('isGameStarted', isGameStarted);
  }, [isGameStarted]);

  const handleFunction1Click = () => {
    setIsFunction1Active(!isFunction1Active);
  };

  const handleFunction2Click = () => {
    setIsFunction2Active(!isFunction2Active); 
  };

  const handleBackgroundConfirm = (background) => {
    setIsFunction1Active(false);
    
    if (background === null) {
      // If "None" is selected, store 'none' in localStorage and remove background
      localStorage.setItem('selectedBackground', 'none');
      document.documentElement.style.setProperty('--selected-background', 'none');
    } else {
      // Save the selected background image
      localStorage.setItem('selectedBackground', background);
      document.documentElement.style.setProperty('--selected-background', `url(${background})`);
    }
  };
  
  const handleFunction2BackgroundConfirm = (background) => {
    setIsFunction2Active(false);
  
    if (background === null) {
      // If "None" is selected, store 'none' in localStorage and remove background
      localStorage.setItem('appBackground', 'none');
      document.documentElement.style.setProperty('--app-background', 'none');
    } else {
      // Save the selected background image
      localStorage.setItem('appBackground', background);
      document.documentElement.style.setProperty('--app-background', `url(${background})`);
    }
  };
  
  const handleBackgroundCancel = () => {
    setIsFunction1Active(false);
  };

  const handleBackgroundCancel2 = () => {
    setIsFunction2Active(false);
  };

  const getNumRemove = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 40;
      case 'Medium':
        return 46;
      case 'Hard':
        return 52;
      case 'Very Hard':
        return 58;
      case 'Extreme':
        return 64;
      default:
        return 40;
    }
  };

  const handleCustomDifficulty = () => {
    setPreviousDifficulty(difficulty);  // Store the current difficulty
    setDifficulty('Custom');
    setShowCustomModal(true);
  };

  const handleCustomSubmit = () => {
    const numRemove = parseInt(customEmptyCells, 10);
    if (!isNaN(numRemove) && numRemove >= 1 && numRemove <= 70) {
      const newSolution = generateFullSolution();
      const newPuzzle = createPuzzleFromSolution(newSolution, numRemove);
      setSolution(newSolution);
      setSudoku(newPuzzle);
      setHistory([]);
      setHintCount(3);
      setShowCustomModal(false);
      setIsGameStarted(true); 
      setTime(0); // Reset the timer when starting the game
    } else {
      alert("Please enter a valid number between 1 and 70.");
    }
  };

  const handleCustomCancel = () => {
    setDifficulty(previousDifficulty);  // Revert to the previous difficulty
    setShowCustomModal(false);  // Close the modal
  };

  const handleDifficultyChange = (level) => {
    setPreviousDifficulty(difficulty);  // Store the current difficulty as previous before changing
    setDifficulty(level);
    const newSolution = generateFullSolution();
    const numRemove = getNumRemove(level);
    const newPuzzle = createPuzzleFromSolution(newSolution, numRemove);
    setSolution(newSolution);
    setSudoku(newPuzzle);
    setHistory([]);
    setHintCount(3);
    setMistakeCount(0);
    setTime(0); // Reset the timer
    setIsGameStarted(true); // Mark the game as started
    setIsGameOver(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused); // Toggle pause state
    setSudokuVisible(!sudokuVisible); // Toggle grid visibility
  };

  const handleResume = () => {
    setIsPaused(false);
    setSudokuVisible(true);
  };

  const handleCellClick = (row, col) => {
    if (isGameOver || isPaused) return; // Block interactions if game is over or paused

    setSelectedCell({ row, col });

    if (eraseMode) {
      const cell = sudoku[row][col];
      if (cell.isEditable) {
        const newSudoku = sudoku.map((r, rowIndex) =>
          r.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return { ...cell, value: null, notes: [] };
            }
            return cell;
          })
        );
        setHistory([...history, sudoku]);
        setSudoku(newSudoku);
        setEraseMode(false);
      }
    }
  };

  const checkCompletion = (grid, row, col) => {
    const isRowComplete = grid[row].every(cell => cell.value !== null && !cell.isError);
    const isColComplete = grid.every(r => r[col].value !== null && !r[col].isError);
  
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    let isBoxComplete = true;
    const boxCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentCell = grid[startRow + i][startCol + j];
        if (currentCell.value === null || currentCell.isError) {
          isBoxComplete = false;
        }
        boxCells.push({ row: startRow + i, col: startCol + j });
      }
    }
  
    return { isRowComplete, isColComplete, isBoxComplete, boxCells };
  };
  

  const handleNumberInput = useCallback((number) => {
    if (!selectedCell || eraseMode || isGameOver || isPaused) return;

    const { row, col } = selectedCell;
    const cell = sudoku[row][col];

    if (!cell.isEditable) return;

    setHistory([...history, sudoku]);

    if (isNotesMode) {
      const newNotes = cell.notes.includes(number)
        ? cell.notes.filter(n => n !== number)
        : [...cell.notes, number].sort();

      const newSudoku = sudoku.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...cell, notes: newNotes };
          }
          return cell;
        })
      );
      setSudoku(newSudoku);
    } else {
      const isError = number !== solution[row][col];

      if (isError) {
        const updatedMistakeCount = mistakeCount + 1;
        setMistakeCount(updatedMistakeCount);
        if (updatedMistakeCount >= 3) {
          setShowMistakeAdModal(true); 
          return;
        }
      }

      const newSudoku = sudoku.map((r, rowIndex) =>
        r.map((cell, colIndex) =>
          rowIndex === row && colIndex === col
            ? { ...cell, value: number, notes: [], isEditable: true, isError }
            : cell
        )
      );

      const { isRowComplete, isColComplete, isBoxComplete, boxCells } = checkCompletion(newSudoku, row, col);
      const newWaveCells = [];

      if (isRowComplete) {
        newWaveCells.push(...newSudoku[row].map((_, colIndex) => ({ row, col: colIndex })));
      }
      if (isColComplete) {
        newWaveCells.push(...newSudoku.map((_, rowIndex) => ({ row: rowIndex, col })));
      }
      if (isBoxComplete) {
        newWaveCells.push(...boxCells);
      }

      setSudoku(newSudoku);
      setSelectedCell(null);

      if (newWaveCells.length > 0) {
        setWaveCells(newWaveCells);
        setTimeout(() => setWaveCells([]), 2000);
      }

      // Check if the game is completed successfully
      const isComplete = newSudoku.every(row =>
        row.every(cell => cell.value !== null && !cell.isError)
      );
      if (isComplete) {
        setIsSuccess(true);
        setIsGameOver(true);
      }
    }
  }, [sudoku, selectedCell, isNotesMode, eraseMode, history, solution, mistakeCount, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = parseInt(event.key, 10);
      if (!isNaN(key) && key >= 1 && key <= 9 && selectedCell) {
        handleNumberInput(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, isNotesMode, handleNumberInput]);

  const handleUndo = () => {
    if (history.length > 0 && !isGameOver && !isPaused) {
      const previousState = history[history.length - 1];
      setSudoku(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleErase = () => setEraseMode(!eraseMode);
  const toggleNotesMode = () => setIsNotesMode(!isNotesMode);
  const handleRestart = () => {
    resetSudoku();
    setIsGameOver(false);
    setIsSuccess(false); // Reset success state
    setIsGameStarted(true); // Ensure the game is marked as started
    setTime(0); 
  };

  const resetSudoku = () => {
    const newSolution = generateFullSolution();
    const numRemove = getNumRemove(difficulty);
    const newPuzzle = createPuzzleFromSolution(newSolution, numRemove);
    setSudoku(newPuzzle);
    setSolution(newSolution);
    setHistory([]);
    setHintCount(3);
    setMistakeCount(0);
    setTime(0);
    setIsGameOver(false);
    setIsSuccess(false); // Reset success state
  };

const handleHint = () => {
  if (hintCount === 0) {
    setShowAdModal(true); 
    return; 
  }

  if (isGameOver || isPaused) {
    setShowNoHintMessage(true);
    setTimeout(() => {
      setShowNoHintMessage(false);
    }, 3000);
    return;
  }

  provideHint();
};

const handleGetHint = () => {
  setShowAdComponent(true);
  setTimeout(() => {
    setHintCount((prev) => prev + 1);
    setShowAdComponent(false);
    setShowAdModal(false);
    setIsPaused(false);
  }, 5000); 
};
const provideHint = () => {
  let emptyCells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudoku[row][col].value === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;
    const correctValue = solution[row][col];

    const newSudoku = sudoku.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col
          ? { ...cell, value: correctValue, notes: [], isEditable: false }
          : cell
      )
    );

    setHistory([...history, sudoku]);
    setSudoku(newSudoku);
    setHintCount(hintCount - 1);
    setFlashingCell(randomCell);

    const { isRowComplete, isColComplete, isBoxComplete, boxCells } = checkCompletion(newSudoku, row, col);
    const newWaveCells = [];

    if (isRowComplete) {
      newWaveCells.push(...newSudoku[row].map((_, colIndex) => ({ row, col: colIndex })));
    }
    if (isColComplete) {
      newWaveCells.push(...newSudoku.map((_, rowIndex) => ({ row: rowIndex, col })));
    }
    if (isBoxComplete) {
      newWaveCells.push(...boxCells);
    }

    if (newWaveCells.length > 0) {
      setWaveCells(newWaveCells);
      setTimeout(() => setWaveCells([]), 2000);
    }

    const isComplete = newSudoku.every(row =>
      row.every(cell => cell.value !== null && !cell.isError)
    );
    if (isComplete) {
      setIsSuccess(true);
      setIsGameOver(true);
    }

    setTimeout(() => {
      setFlashingCell(null);
    }, 2000);
  }
};
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isGameOver && !isPaused && isGameStarted) {
        setTime((prevTime) => {
          if (prevTime >= 3 * 60 * 60) {
            setIsGameOver(true);
            return prevTime;
          }
          return prevTime + 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isPaused, isGameStarted]);

  const updateLeaderboard = async (time, difficulty, playerName = '') => {
    console.log("Updating leaderboard:", { time, difficulty, playerName }); 
    const nameToSubmit = playerName.trim() === '' ? 'Anonymous' : playerName;
    
    try {
      const leaderboardRef = collection(db, `leaderboard-${difficulty}`);
      await addDoc(leaderboardRef, { player: nameToSubmit, time });
      console.log("Document successfully written!");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error adding document:", error); 
    }
  };
  
  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  return (
    <div className="App">
      <Sidebar 
        onFunction1={handleFunction1Click} 
        onFunction2={handleFunction2Click}
        onFunction3={handleShowLeaderboard} // Display leaderboard on click
        onFunction4={handleFunction4Click}
      />

{showMistakeAdModal && (
  <div
    className="ad-modal"
    onClick={() => {
      setShowMistakeAdModal(false); 
      if (mistakeCount >= 3) {
        setIsGameOver(true); 
      }
    }}
  >
    <div
      className="ad-modal-content"
      onClick={(e) => e.stopPropagation()} 
    >
      <h3>Watch this ad to reduce a mistake</h3>
      <div className="ad-buttons">
        <button
          className="adbutton"
          onClick={() => {
            setShowMistakeAdModal(false);
            setShowAdComponent(true); 
            setIsPaused(true);
            setTimeout(() => {
              setMistakeCount((prev) => Math.max(0, prev - 1)); 
              setShowAdComponent(false); 
              setShowMistakeAdModal(false);
              setIsPaused(false);  
            }, 5000);
          }}
        >
          Reduce Mistake
        </button>
        <button
          className="adbutton"
          onClick={() => {
            setShowMistakeAdModal(false);
            if (mistakeCount >= 3) {
              setIsGameOver(true);
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{showAdModal && (
        <div className="ad-modal" onClick={() => setShowAdModal(false)}>
          <div
            className="ad-modal-content"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>Watch this ad to gain an extra hint</h3>
            <div className="ad-buttons">
              <button className="adbutton" 
          onClick={() => {
            setShowAdModal(false); 
            handleGetHint();
            setIsPaused(true);
          }}>
                Get Hint
              </button>
              <button
                className="adbutton"
                onClick={() => setShowAdModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAdComponent && <AdComponent />}

      {showInstructions && (
        <InstructionsModal onClose={handleCloseInstructions} />
      )}
      {isGameOver && (
        <GameOverModal
          onRestart={handleRestart}
          difficulty={difficulty}
          time={time}
          isSuccess={isSuccess}
          playerName={playerName} // Pass playerName state
          setPlayerName={setPlayerName} // Provide function to update playerName
          onSubmitName={() => updateLeaderboard(time, difficulty, playerName)} 
        />
      )}
      {isFunction1Active && (
        <Function1Options onConfirm={handleBackgroundConfirm} onClose={handleBackgroundCancel} />
      )}
      {isFunction2Active && (
        <Function2Options onConfirm={handleFunction2BackgroundConfirm} onClose={handleBackgroundCancel2} />
      )}
      {isPaused && (
        <div className="resume-modal">
          <div className="modal-content2">
            <h2>Paused</h2>
            <button onClick={handleResume} className="resume-button">Resume</button>
          </div>
        </div>
      )}

      <div>
        <div className="difficulty-buttons">
          {['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme'].map(level => (
            <button
              key={level}
              className={`difficulty-button ${difficulty === level ? 'selected' : ''}`}
              onClick={() => handleDifficultyChange(level)}
            >
              {level}
            </button>
          ))}
          <button
            className={`difficulty-button ${difficulty === 'Custom' ? 'selected' : ''}`}
            onClick={handleCustomDifficulty}
          >
            Custom
          </button>
        </div>

        <Grid sudoku={sudoku} selectedCell={selectedCell} onCellClick={handleCellClick} flashingCell={flashingCell} waveCells={waveCells} sudokuVisible={sudokuVisible} />
      </div>

      <div className="hint-container" style={{ position: 'relative' }}>
        <Controls
          onNumberSelect={handleNumberInput}
          resetSudoku={resetSudoku}
          onUndo={handleUndo}
          toggleNotesMode={toggleNotesMode}
          handleErase={handleErase}
          handleHint={handleHint}
          isNotesMode={isNotesMode}
          eraseMode={eraseMode}
          hintCount={hintCount}
          mistakeCount={mistakeCount}
          time={time}
          handlePause={handlePause} // Pass the pause handler
          isPaused={isPaused} // Pass the pause state
        />
        {showNoHintMessage && (
          <div className="no-hint-message">
            No hints remaining
          </div>
        )}
      </div>

      {showCustomModal && (
        <div className="custom-modal">
          <div className="modal-content">
            <h3>Custom Difficulty</h3>
            <p>Enter the number of empty cells (1-70):</p>
            <input
              type="number"
              value={customEmptyCells}
              onChange={(e) => setCustomEmptyCells(e.target.value)}
              min="1"
              max="70"
            />
            <button onClick={handleCustomSubmit}>Submit</button>
            <button onClick={handleCustomCancel}>Cancel</button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <LeaderboardModal leaderboard={leaderboard} onClose={handleCloseLeaderboard} />
      )}
      <img src="cat2.gif" alt="Floating" className="floating-image" />
      <img src="hh.gif" alt="Floating2" className="floating-image2" />
    </div>
  );
}

// Leaderboard Modal Component
function LeaderboardModal({ leaderboard, onClose }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy'); // Track the selected difficulty

  const handleDifficultyClick = (level) => {
    setSelectedDifficulty(level); // Update selected difficulty when clicked
  };

  return (
    <div 
    className="leaderboard-backdrop" 
    onClick={onClose} // Close the leaderboard when clicking on the backdrop
  >
    <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content1" >
        <h2>Leaderboard</h2>

        {/* Render difficulty buttons */}
        {['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme'].map((level) => (
          <button
            key={level}
            className={`difficulty-button ${selectedDifficulty === level ? 'selected' : ''}`}
            onClick={() => handleDifficultyClick(level)}
          >
            {level}
          </button>
        ))}

        {/* Show rankings or a message if no rankings are available */}
        <div className="leaderboard-content">
          <h3>{selectedDifficulty}</h3>
          {leaderboard[selectedDifficulty]?.length > 0 ? (
            <ol>
              {leaderboard[selectedDifficulty].map((entry, index) => (
                <li key={index}>{entry.player}: {entry.time} seconds</li>
              ))}
            </ol>
          ) : (
            <p>No rankings available</p> 
          )}
        </div>

        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
    </div>
  );
}


export default App;
