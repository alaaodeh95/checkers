import { MAX_BOARD, MIN_BOARD } from '../../constants/constants';
import { Moves, PieceId, Player, Square } from '../../types/gameTypes';
import { isSameCords } from '../../utils/game';
import { highlightSquare, incrementMovesCount, resetHighlights, setExtraMove, setSelected, setSquare, setTurn } from '../reducers/gameSlice';
import { getIsKing, getLocationHistory, getMovablePiecesWithState, getMoves, getTurn } from '../selectors';
import { ActionFn } from '../store/store';
import { handleSwitchTurn } from './game';

export const highlightMovablePieces =
    (cords: [number, number]): ActionFn =>
    (dispatch, getState) => {
        const {
            game: { board, turn },
        } = getState();
        const moves: Moves = getMoves(cords, turn)(board);
        moves.to.forEach((move) => dispatch(highlightSquare(move)));
    };

export const highlightMoves =
    (cords: [number, number]): ActionFn =>
    (dispatch, getState) => {
        const {
            game: { board, turn },
        } = getState();
        const moves: Moves = getMoves(cords, turn)(board);
        moves.to.forEach((move) => dispatch(highlightSquare(move)));
    };

export const makeMove =
    (from: Square, to: Square): ActionFn =>
    (dispatch, getState) => {
        const currentPlayer = getTurn(getState());

        // Check if the piece if still or new king
        const wasKing = getIsKing(from.location)(getState().game.board);
        const isKing = wasKing || (currentPlayer === Player.Player1 && to.location[0] === MAX_BOARD) || (currentPlayer === Player.Player2 && to.location[0] === MIN_BOARD);
        const isNewKing = !wasKing && isKing;

        // Empty from square
        const locationHistory = [...getLocationHistory(from.location)(getState().game.board), to.location];
        dispatch(setSquare({ ...from, piece: { id: PieceId.Null, locationHistory: [] }, isHighlighted: false }));

        // Kill any checker inbetween
        const shouldKill = Math.abs(from.location[0] - to.location[0]) === 2;
        if (shouldKill) {
            const [x0, y0] = from.location;
            const [x1, y1] = to.location;
            const deadX = x0 < x1 ? x0 + 1 : x0 - 1;
            const deadY = y0 < y1 ? y0 + 1 : y0 - 1;
            dispatch(setSquare({ location: [deadX, deadY], piece: { id: PieceId.Null, locationHistory: [] }, isHighlighted: false }));
        }

        // Move to next square
        const newPieceIdType = currentPlayer === Player.Player1 ? (isKing ? PieceId.Player1King : PieceId.Player1) : isKing ? PieceId.Player2King : PieceId.Player2;
        dispatch(setSquare({ ...to, piece: { id: newPieceIdType, locationHistory: locationHistory }, isHighlighted: false }));

        // Switch turn and reset highlights
        dispatch(resetHighlights());
        dispatch(setSelected(null));

        const movablePieces = getMovablePiecesWithState(getState());

        if (!isNewKing && shouldKill) {
            const extraMove = movablePieces.filter((piece) => piece.isKiller && isSameCords(piece.from, to.location));
            if (extraMove.length === 1) {
                dispatch(setExtraMove(extraMove[0]));
                return;
            }
        }

        dispatch(setExtraMove(null));
        dispatch(setTurn(currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1));
        dispatch(incrementMovesCount());
        dispatch(handleSwitchTurn());
    };
