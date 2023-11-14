import { Board, PieceId, Player } from '../../types/gameTypes';
import { RootState } from '../store/store';
import { getMovablePieces } from './moves';

export * from './moves';
export const getBoard = (state: RootState) => state.game.board;
export const getSelected = (state: RootState) => state.game.selected;
export const getDifficulty = (state: RootState) => state.game.difficulty;
export const getMode = (state: RootState) => state.game.mode;
export const getTurn = (state: RootState) => state.game.turn;
export const getLocationHistory = (cords: [number, number]) => (board: Board) => getSquare(cords)(board).piece.locationHistory;
export const getExtraMove = (state: RootState) => state.game.extraMove;
export const getAIMoves = (state: RootState) => state.game.aiMoves;
export const getSquare = (cords: [number, number]) => (board: Board) => board[cords[0]][cords[1]];
export const getIsKing = (cords: [number, number]) => (board: Board) => getSquare(cords)(board).piece.id.toString().includes('King');
export const getMovesCount = (state: RootState) => state.game.movesCount;
export const getNumberOfPieces =  (state: RootState) => {
    const pieces = state.game.board.flatMap(row => row).map(square => square.piece.id);
    return {
        player1: pieces.filter( id => id === PieceId.Player1).length,
        player1King: pieces.filter( id => id === PieceId.Player1King).length,
        player2: pieces.filter( id => id === PieceId.Player2).length,
        player2King: pieces.filter( id => id === PieceId.Player2King).length,
    }
}
export const getPlayerOnSquare = (cords: [number, number]) => (board: Board) => {
    const piece = getSquare(cords)(board).piece.id.toString();
    return piece.startsWith(Player.Player1) ? Player.Player1 : piece.startsWith(Player.Player2) ? Player.Player2 : null;
};
export const isOpponentOnSquare = (cords: [number, number], currentPlayer: Player) => (board: Board) => {
    const player = getPlayerOnSquare(cords)(board);
    return player !== null && player !== currentPlayer;
};

export const getWinner = (turn: Player, board: Board) => {
    const movables = getMovablePieces(board, turn);
    if (movables.length === 0) {
        return turn === Player.Player1 ? Player.Player2 : Player.Player1;
    }
    return null;
};
