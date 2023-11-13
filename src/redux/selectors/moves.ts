import { getIsKing, getPlayerOnSquare, isOpponentOnSquare, getExtraMove } from '.';
import { MAX_BOARD, MIN_BOARD } from '../../constants/constants';
import { AIMove, Board, PieceId, Player } from '../../types/gameTypes';
import { clone, isInRange, isSameCords } from '../../utils/game';
import { RootState } from '../store/store';

export const getMoves = (cords: [number, number], player: Player) => (board: Board) => {
    const isKing = getIsKing(cords)(board);

    // Possible cords
    const [x, y] = cords;
    const xUp = x + 1;
    const xDown = x - 1;
    const yRight = y + 1;
    const yLeft = y - 1;

    // Simple moves
    const topLeft: [number, number] = [xUp, yLeft];
    const topKillerLeft: [number, number] = [xUp + 1, yLeft - 1];
    const topRight: [number, number] = [xUp, yRight];
    const topKillerRight: [number, number] = [xUp + 1, yRight + 1];
    const bottomLeft: [number, number] = [xDown, yLeft];
    const bottomKillerLeft: [number, number] = [xDown - 1, yLeft - 1];
    const bottomRight: [number, number] = [xDown, yRight];
    const bottomKillerRight: [number, number] = [xDown - 1, yRight + 1];

    const possibleMoves: Array<[number, number]> = [];
    const possibleKillerMoves: Array<[number, number]> = [];

    const pushTopMoves = () => {
        isInRange(topLeft) && getPlayerOnSquare(topLeft)(board) === null && possibleMoves.push(topLeft);
        isInRange(topRight) && getPlayerOnSquare(topRight)(board) === null && possibleMoves.push(topRight);
    };

    const pushTopKillerMoves = () => {
        isInRange(topKillerLeft) && getPlayerOnSquare(topKillerLeft)(board) === null && isOpponentOnSquare(topLeft, player)(board) && possibleKillerMoves.push(topKillerLeft);
        isInRange(topKillerRight) && getPlayerOnSquare(topKillerRight)(board) === null && isOpponentOnSquare(topRight, player)(board) && possibleKillerMoves.push(topKillerRight);
    };

    const pushDownMoves = () => {
        isInRange(bottomLeft) && getPlayerOnSquare(bottomLeft)(board) === null && possibleMoves.push(bottomLeft);
        isInRange(bottomRight) && getPlayerOnSquare(bottomRight)(board) === null && possibleMoves.push(bottomRight);
    };

    const pushDownKillerMoves = () => {
        isInRange(bottomKillerLeft) && getPlayerOnSquare(bottomKillerLeft)(board) === null && isOpponentOnSquare(bottomLeft, player)(board) && possibleKillerMoves.push(bottomKillerLeft);
        isInRange(bottomKillerRight) && getPlayerOnSquare(bottomKillerRight)(board) === null && isOpponentOnSquare(bottomRight, player)(board) && possibleKillerMoves.push(bottomKillerRight);
    };

    if (player === Player.Player1) {
        pushTopMoves();
        pushTopKillerMoves();
        isKing && pushDownMoves();
        isKing && pushDownKillerMoves();
    }

    if (player === Player.Player2) {
        pushDownMoves();
        pushDownKillerMoves();
        isKing && pushTopMoves();
        isKing && pushTopKillerMoves();
    }

    const isKiller = possibleKillerMoves?.length > 0;
    return {
        from: cords,
        to: isKiller ? possibleKillerMoves : possibleMoves,
        isKiller,
    };
};

export const getMovablePieces = (board: Board, currentPlayer: Player) => {
    const allSquares = board.flatMap((x) => x);

    const playerSquares = allSquares.filter((square) => getPlayerOnSquare(square.location)(board) === currentPlayer);
    const possibleSquares = playerSquares.map((square) => getMoves(square.location, currentPlayer)(board)).filter((moves) => moves.to.length > 0);
    const killerSquares = possibleSquares.filter((square) => square.isKiller);
    return killerSquares?.length > 0 ? killerSquares : possibleSquares;
};

export const getMovablePiecesWithState = (state: RootState) => {
    const extraMove = getExtraMove(state);
    if (extraMove) {
        return [extraMove];
    }

    const {
        game: { board, turn },
    } = state;

    return getMovablePieces(board, turn);
};

export const exploreMove = (from: [number, number], to: [number, number], board: Board, currentPlayer: Player, moves: AIMove[] = []): { board: Board; moves: AIMove[] } => {
    // Check if the piece if still or new king
    const wasKing = getIsKing(from)(board);
    const isKing = wasKing || (currentPlayer === Player.Player1 && to[0] === MAX_BOARD) || (currentPlayer === Player.Player2 && to[0] === MIN_BOARD);
    const isNewKing = !wasKing && isKing;

    // Empty from square
    const movedPieceLocationHistory = clone(board[from[0]][from[1]].piece.locationHistory);
    board[from[0]][from[1]] = { location: from, piece: { id: PieceId.Null, locationHistory: [] } };

    // Kill any checker inbetween
    const shouldKill = Math.abs(from[0] - to[0]) === 2;
    if (shouldKill) {
        const [x0, y0] = from;
        const [x1, y1] = to;
        const deadX = x0 < x1 ? x0 + 1 : x0 - 1;
        const deadY = y0 < y1 ? y0 + 1 : y0 - 1;
        board[deadX][deadY] = { location: from, piece: { id: PieceId.Null, locationHistory: [] } };
    }

    // Move to next square
    const newPieceType = currentPlayer === Player.Player1 ? (isKing ? PieceId.Player1King : PieceId.Player1) : isKing ? PieceId.Player2King : PieceId.Player2;
    board[to[0]][to[1]] = { location: to, piece: { id: newPieceType, locationHistory: movedPieceLocationHistory } };
    moves.push({ from, to });

    // If not a new king and the last move caused a kill, try to progress
    if (!isNewKing && shouldKill) {
        const movablePieces = getMovablePieces(board, currentPlayer);
        const extraMove = movablePieces.filter((piece) => piece.isKiller && isSameCords(piece.from, to));
        if (extraMove.length === 1) {
            return exploreMove(extraMove[0].from, extraMove[0].to[0], board, currentPlayer, moves);
        }
    }

    return { board, moves };
};
