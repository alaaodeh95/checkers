import { getMoves, getPlayerOnSquare } from '../redux/selectors';
import { Node, PieceId, Player } from '../types/gameTypes';

export const evaluationConfig = {
    centerRows: [3, 4],
    centerWeight: 0.3,
    nearingKingingWeight: 0.5,
    pieceValue: {
        player1: -1,
        player1King: -3,
        player2: 1,
        player2King: 3,
    },
    botInitialRow: 7,
    mobilityWeight: 0.2,
    jumpWeight: 0.8,
    endgameThreshold: 12, // Number of total pieces below which the game is considered to be in endgame
    endgameKingWeight: 0.7, // Additional weight for kings in endgame
    minMovesBeforePenaltyOnInitial: 15, // Number of moves before penatlies on initial poistion 
    initialPositionPenalty: 0.2
};

export const evaluateBoard = (node: Node, movesCount: number, config = evaluationConfig) => {
    let score = 0;
    let totalPieces = 0; // To determine if the game is in the endgame phase

    node.board.forEach((row, rowIdx) => {
        row.forEach((square) => {
            if (square.piece.id !== PieceId.Null) {
                const player = getPlayerOnSquare(square.location)(node.board);
                const moves = getMoves(square.location, player!)(node.board);
                totalPieces++;

                // Basic weight based on number of pieces 
                score += config.pieceValue[square.piece.id];

                // Control of center
                if (config.centerRows.includes(rowIdx)) {
                    score += square.piece.id === PieceId.Player2 ? config.centerWeight : -config.centerWeight;
                }

                // Nearing Kinging
                if (square.piece.id === PieceId.Player1 || square.piece.id === PieceId.Player2) {
                    if (square.piece.id === PieceId.Player2 && rowIdx === node.board.length - 1) {
                        score += config.nearingKingingWeight;
                    } else if (square.piece.id === PieceId.Player1 && rowIdx === 0) {
                        score -= config.nearingKingingWeight;
                    }
                }

                // Piece Mobility
                score += moves.mobility.length * (player === Player.Player1 ? -1 : 1) * config.mobilityWeight;

                // Jump weight
                if (moves.isKiller) {
                    score += moves.to.length * (player === Player.Player1 ? -1 : 1) * config.jumpWeight;
                }

                // Penalty for staying in initial position after early game
                if (movesCount > config.minMovesBeforePenaltyOnInitial && square.piece.id === PieceId.Player2 && rowIdx === config.botInitialRow) {
                    score -= config.initialPositionPenalty;
                }
            }
        });
    });

    // Adjust for endgame strategy
    score += (totalPieces < config.endgameThreshold) ? adjustForEndgame(node, config) : 0;
    return score;
};


const adjustForEndgame = (node: Node, config = evaluationConfig) => {
    let endgameScore = 0;
    // Increase the value of kings in the endgame
    node.board.forEach(row => {
        row.forEach(square => {
            if (square.piece.id === PieceId.Player2King) {
                endgameScore += config.endgameKingWeight;
            } else if (square.piece.id === PieceId.Player1King) {
                endgameScore -= config.endgameKingWeight;
            }
        });
    });
    return endgameScore;
}
