import { exploreMove, getMovablePieces } from '../redux/selectors';
import { Piece, Node } from '../types/gameTypes';
import { clone, switchPlayers } from '../utils/game';

export const isGameEnded = (node: Node) => node.board.flatMap((x) => x).filter((square) => square.piece !== Piece.Null).length === 1;

export const generateChildNodes = (node: Node): Node[] => {
    const children: Node[] = [];

    getMovablePieces(node.board, node.currentPlayer).forEach((moves) => {
        const { from, to: destinations } = moves;
        destinations.forEach((to) => {
            const { board, moves } = exploreMove(from, to, clone(node.board), node.currentPlayer, []);
            children.push({ board, moves, currentPlayer: switchPlayers(node.currentPlayer) });
        });
    });

    // Generate child nodes by making valid moves
    return children;
};

export const evaluationConfig = {
    centerRows: [3, 4],
    centerWeight: 0.3,
    nearingKingingWeight: 0.5,
    pieceValue: {
        player1: -1, // Opponent's regular piece
        player1King: -3, // Opponent's king
        player2: 1, // AI's regular piece
        player2King: 3, // AI's king
    },
};

export const evaluateBoard = (node: Node, config = evaluationConfig) => {
    let score = 0;

    node.board.forEach((row, rowIdx) => {
        row.forEach((square) => {
            if (square.piece !== Piece.Null) {
                // Basic material value
                score += config.pieceValue[square.piece];

                // Check if the piece is a regular piece (not a king)
                if (square.piece === Piece.Player1 || square.piece === Piece.Player2) {
                    // Positional value for nearing king row (only for non-kings)
                    if (square.piece === Piece.Player2 && rowIdx === node.board.length - 1) {
                        score += config.nearingKingingWeight; // Bot piece nearing kinging
                    } else if (square.piece === Piece.Player1 && rowIdx === 0) {
                        score -= config.nearingKingingWeight; // Player1 piece nearing kinging
                    }

                    // Control of center
                    if (config.centerRows.includes(rowIdx)) {
                        score += square.piece === Piece.Player2 ? config.centerWeight : -config.centerWeight;
                    }
                }
            }
        });
    });

    return score;
};
