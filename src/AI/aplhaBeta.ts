import { exploreMove, getMovablePieces, getWinner } from '../redux/selectors';
import { AIMove, Node, Player } from '../types/gameTypes';
import { clone, switchPlayers } from '../utils/game';
import { evaluateBoard } from './evaluate';

export const alphaBetaSearch = (node: Node, depth: number, alpha: number, beta: number, maximizingPlayer: boolean, movesCount: number): [AIMove[], number] => {
    const winner = getWinner(node.currentPlayer, node.board);
    if (depth === 0) {
        return [node.moves, evaluateBoard(node, movesCount)]; // Return the evaluation at the leaf node
    } else if (winner) {
        return [node.moves, winner === Player.Player1 ? Number.MIN_VALUE : Number.MAX_VALUE]; // Game over
    }

    let bestMove: AIMove[] = [];
    let bestEval = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    if (maximizingPlayer) {
        for (const child of generateChildNodes(node)) {
            const [, childEval] = alphaBetaSearch(child, depth - 1, alpha, beta, false, movesCount);
            if (childEval > bestEval) {
                bestEval = childEval;
                bestMove = child.moves; // Assuming `child` has a `move` attribute representing the action taken
            }
            alpha = Math.max(alpha, bestEval);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }
    } else {
        for (const child of generateChildNodes(node)) {
            const [, childEval] = alphaBetaSearch(child, depth - 1, alpha, beta, true, movesCount);
            if (childEval < bestEval) {
                bestEval = childEval;
                bestMove = child.moves; // Assuming `child` has a `move` attribute representing the action taken
            }
            beta = Math.min(beta, bestEval);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }
    }

    return [bestMove, bestEval];
};

const generateChildNodes = (node: Node): Node[] => {
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