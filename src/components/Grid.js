import React from 'react';
import Cell from './Cell/Cell';

function Grid({ sudoku, selectedCell, flashingCell, waveCells, onCellClick, sudokuVisible }) {
  return (
    <div className="grid">
      {sudoku.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell && rowIndex === selectedCell.row && colIndex === selectedCell.col;
          const isInSameRow = selectedCell && rowIndex === selectedCell.row;
          const isInSameCol = selectedCell && colIndex === selectedCell.col;
          const isInSameBox = selectedCell &&
                              Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
                              Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3);
          
          const selectedCellValue = selectedCell && sudoku[selectedCell.row][selectedCell.col].value;
          const isSameValue = selectedCellValue && cell.value === selectedCellValue;

          const isFlashing = flashingCell && flashingCell.row === rowIndex && flashingCell.col === colIndex;
          const isError = cell.isError;
          const isWave = waveCells.some(c => c.row === rowIndex && c.col === colIndex);

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={sudokuVisible ? cell.value : ''} // Hide cell values if paused
              notes={sudokuVisible ? cell.notes : []}
              onClick={() => onCellClick(rowIndex, colIndex)}
              isSelected={isSelected}
              isSameValue={isSameValue}
              isInSameGroup={isInSameRow || isInSameCol || isInSameBox}
              isFlashing={isFlashing}
              isError={isError}
              isWave={isWave}
            />
          );
        })
      )}
    </div>
  );
}

export default Grid;
