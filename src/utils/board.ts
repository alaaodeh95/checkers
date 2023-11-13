import { Board } from '../types/gameTypes';

export const getSquareFromBoard = (board: Board) => (cords: [number, number]) => board[cords[0]][cords[1]];
