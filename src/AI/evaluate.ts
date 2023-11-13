import { exploreMove, getMovablePieces } from '../redux/selectors';
import { Node, PieceId } from '../types/gameTypes';
import { clone, switchPlayers, countSpecificPairOccurrences } from '../utils/game';

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
    botInitialRow: 7,
};

export const evaluateBoard = (node: Node, movesCount: number, config = evaluationConfig) => {
    let score = 0;

    node.board.forEach((row, rowIdx) => {
        row.forEach((square) => {
            if (square.piece.id !== PieceId.Null) {
                // Basic material value
                score += config.pieceValue[square.piece.id];

                // Control of center
                if (config.centerRows.includes(rowIdx)) {
                    score += square.piece.id === PieceId.Player2 ? config.centerWeight : -config.centerWeight;
                }

                // Check if the piece is a regular piece (not a king)
                if (square.piece.id === PieceId.Player1 || square.piece.id === PieceId.Player2) {
                    // Positional value for nearing king row (only for non-kings)
                    if (square.piece.id === PieceId.Player2 && rowIdx === node.board.length - 1) {
                        score += config.nearingKingingWeight; // Bot piece nearing kinging
                    } else if (square.piece.id === PieceId.Player1 && rowIdx === 0) {
                        score -= config.nearingKingingWeight; // Player1 piece nearing kinging
                    }

                    // Additional logic for initial position penalty
                    if (movesCount > 10) {
                        // Assuming the penalty starts after 10 moves
                        if (square.piece.id === PieceId.Player2 && rowIdx === config.botInitialRow) {
                            score -= 0.2; // Apply a penalty
                        }
                    }
                }

                if (square.piece.id === PieceId.Player2King) {
                    // Penalize if the king's position has been repeated
                    const positionRepeats = countSpecificPairOccurrences(square.piece.locationHistory, square.location, 6);
                    if (positionRepeats > 1) {
                        score -= 0.5 * positionRepeats;
                    }
                }
            }
        });
    });

    return score;
};
