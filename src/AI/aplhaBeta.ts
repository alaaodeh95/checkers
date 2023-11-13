import { AIMove, Node } from '../types/gameTypes';
import { generateChildNodes, isGameEnded, evaluateBoard } from './evaluate';

export const alphaBetaSearch = (node: Node, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): [AIMove[], number] => {
    if (depth === 0 || isGameEnded(node)) {
        return [node.moves, evaluateBoard(node)]; // Return the evaluation at the leaf node
    }

    let bestMove: AIMove[] = [];
    let bestEval = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    if (maximizingPlayer) {
        for (const child of generateChildNodes(node)) {
            const [, childEval] = alphaBetaSearch(child, depth - 1, alpha, beta, false);
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
            const [, childEval] = alphaBetaSearch(child, depth - 1, alpha, beta, true);
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
