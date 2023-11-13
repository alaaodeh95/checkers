import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/store/hooks';
import '../styles/styles.css';
import { getAIMoves, getBoard, getMovablePiecesWithState, getSelected } from '../redux/selectors';
import { handleSquareClick } from '../redux/actions/game';
import WinnerScreen from './WinnerScreen';
import { setAIMoves } from '../redux/reducers/gameSlice';

const GameBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const board = useAppSelector(getBoard);
    const selectedSquare = useAppSelector(getSelected);
    const movablePieces = useAppSelector(getMovablePiecesWithState);
    const aiMoves = useAppSelector(getAIMoves);

    useEffect(() => {
        if (aiMoves.length > 0) {
            aiMoves.forEach((move, idx) => {
                setTimeout(() => dispatch(handleSquareClick(move.from)), idx*500);
                setTimeout(() => dispatch(handleSquareClick(move.to)), idx*500 + 500);
            });
            dispatch(setAIMoves([]));
        }
    }, [aiMoves, dispatch]);

    return (
        <div className="game-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((square, colIndex) => (
                        <div
                            key={colIndex}
                            onClick={(e) => dispatch(handleSquareClick([rowIndex, colIndex], e))}
                            className={`square ${square.isHighlighted ? 'highlighted' : ''} ${(rowIndex + colIndex) % 2 === 0 ? 'light-square' : 'dark-square'}`}
                        >
                            {square.piece && (
                                <div
                                    className={`piece ${square.piece.toString().includes('player1') ? 'player1-piece' : 'player2-piece'} ${square.piece.toString().includes('King') ? 'king' : ''} ${
                                        square.location === selectedSquare?.location ? 'selected' : ''
                                    } ${movablePieces.some((piece) => piece.from === square.location) ? 'with-border' : ''}`}
                                >
                                    {square.piece.toString().includes('King') ? 'K' : ''}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <WinnerScreen />
        </div>
    );
};

export default GameBoard;
