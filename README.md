# 🧩Sudorku

Welcome to Sudorku, a unique twist on classic Sudoku, created for puzzle enthusiasts who want more than just numbers on a grid. This app brings the charm with customizable difficulties, floating animations, and fun features for a more engaging Sudoku experience.

![Screenshot](public/sudo.gif)

## To play this game, click [here](https://sudorku-96c3a.web.app/)

## 🌟 Features

- Customizable Difficulty Levels: Choose from five levels (Easy to Extreme) or create your own custom challenge!
- Hints & Mistakes Counter: Use hints when you're stuck, but be careful—too many mistakes will end the game.
- Pause & Resume: Take a break anytime, and resume without losing progress.
- Leaderboard Glory: Compete on the leaderboard for each difficulty and see how fast you can solve the puzzle.
- Personalized Backgrounds: Choose from fun background themes, and add a personal touch to your puzzle!
- Notes & Eraser Mode: Jot down possible numbers or erase them as you think through your moves.
- Success Animations: Complete a row, column, or block and watch as a wave of success marks your progress.

## 🛠️ Tech Stack

- Frontend: React.js
- Backend: Firebase Firestore (for leaderboard data)
- Additional Tools: CSS for styling, Firebase for data persistence.

## 🤓 How It Works

1. Puzzle Generation: A fully solved Sudoku board is generated and numbers are removed based on difficulty to create the puzzle.
2. User Interactions: Click cells, enter numbers, toggle Notes mode, or use the Eraser to manage entries.
3. Hints and Errors: Use hints for help but watch your mistakes—3 mistakes, and the game is over!
4. Save Progress: Your background and game settings are stored locally, so you can pick up right where you left off.
