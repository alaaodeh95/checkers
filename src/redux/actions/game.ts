import { resetHighlights, setAIMoves, setSelected } from '../reducers/gameSlice';
import { getDifficulty, getMode, getMovablePieces, getPlayerOnSquare, getSelected, getSquare, getTurn, getWinner } from '../selectors';
import { ActionFn } from '../store/store';
import { highlightMoves, makeMove } from './moves';
import { difficultyToDepth, isSameCords } from '../../utils/game';
import { Mode, Player } from '../../types/gameTypes';
import { alphaBetaSearch, Node } from '../../AI';

export const handleSquareClick =
    (cords: [number, number], e?: React.MouseEvent<HTMLDivElement, MouseEvent>): ActionFn =>
    (dispatch, getState) => {
        const state = getState();
        const {
            game: { turn: currentPlayer, board },
        } = state;
        const square = getSquare(cords)(board);
        const playerOnSquare = getPlayerOnSquare(cords)(board);
        const selected = getSelected(state);
        const movablePieces = getMovablePieces(board, currentPlayer);
        const mode = getMode(state);

        // Clicking on bot squares
        if (mode === Mode.OnePlayer && currentPlayer === Player.Player2 && e) {
            return;
        }

        // Unselect
        if (selected !== null && isSameCords(selected.location, cords)) {
            dispatch(setSelected(null));
            dispatch(resetHighlights());
            return;
        }

        // Invalid click - skip
        if ((playerOnSquare === null && !square.isHighlighted) || (playerOnSquare !== null && (playerOnSquare !== currentPlayer || !movablePieces.some((piece) => isSameCords(piece.from, cords))))) {
            console.log(`Skipping invalid click on ${cords}`);
            return;
        }

        // Possible move calculate when click on current player piece
        if (playerOnSquare === currentPlayer) {
            dispatch(setSelected(square));
            dispatch(resetHighlights());
            dispatch(highlightMoves(cords));
            return;
        }

        // Move if piece is highlighted (Valid move)
        if (square.isHighlighted) {
            const fromlSquare = getSelected(getState());
            dispatch(makeMove(fromlSquare!, square));
        }
    };

export const handleSwitchTurn = (): ActionFn => async (dispatch, getState) =>
    new Promise((resolve) => {
        const processHeavyComputations = () => {
            const state = getState();
            const mode = getMode(state);
            const currentPlayer = getTurn(state);
            const winner = getWinner(state);
            const depth = difficultyToDepth(getDifficulty(state));

            // Skip switch turn if not AI turn or if game ended
            if (mode === Mode.TwoPlayers || currentPlayer === Player.Player1 || winner !== null) {
                return;
            }

            const node: Node = { board: state.game.board, moves: [], currentPlayer };
            const [moves] = alphaBetaSearch(node, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
            dispatch(setAIMoves(moves));
            resolve();
        };

        setTimeout(() => processHeavyComputations(), 500);
    });
