import { Board, Piece, PieceId } from '../../types/gameTypes';

const createInitialPiece = (row: number, col: number): Piece => {
    if (row % 2 === col % 2) {
        if (row < 3) return { id: PieceId.Player1 };
        if (row > 4) return { id: PieceId.Player2 };
    }
    return { id: PieceId.Null };
};

const initialBoard: Board = Array.from({ length: 8 }, (_, rowIndex) =>
    Array.from({ length: 8 }, (_, colIndex) => ({
        piece: createInitialPiece(rowIndex, colIndex),
        isHighlighted: false,
        location: [rowIndex, colIndex],
    }))
);

export default initialBoard;
