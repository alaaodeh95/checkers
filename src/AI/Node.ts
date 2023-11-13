import { exploreMove, getMovablePieces } from '../redux/selectors';
import { Board, AIMove, Piece, Player } from '../types/gameTypes';
import { clone, switchPlayers } from '../utils/game';

export type Node = {
    board: Board;
    currentPlayer: Player;
    moves: AIMove[];
};

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

export const evaluateBoard = (node: Node) => {
    return Math.random();
};
