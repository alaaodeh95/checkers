import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Difficulty, Player, Mode, Square, Moves, AIMove } from '../../types/gameTypes';
import initialBoard from './initialBoard';

export const initialGameState: GameState = {
    board: initialBoard,
    difficulty: Difficulty.Easy,
    turn: Player.Player1,
    mode: Mode.OnePlayer,
    selected: null,
    extraMove: null,
    aiMoves: [],
    movesCount: 0,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        setTurn: (state, action: PayloadAction<Player>) => {
            state.turn = action.payload;
        },
        setDifficulty: (state, action: PayloadAction<Difficulty>) => {
            state.difficulty = action.payload;
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
        setSelected: (state, action: PayloadAction<Square | null>) => {
            state.selected = action.payload;
        },
        highlightSquare: (state, action: PayloadAction<[number, number]>) => {
            const [x, y] = action.payload;
            state.board[x][y].isHighlighted = true;
        },
        resetHighlights: (state) => {
            state.board.forEach((row) => row.forEach((square) => (square.isHighlighted = false)));
        },
        setSquare: (state, action: PayloadAction<Square>) => {
            const [x, y] = action.payload.location;
            state.board[x][y] = action.payload;
        },
        setExtraMove: (state, action: PayloadAction<Moves | null>) => {
            state.extraMove = action.payload;
        },
        setAIMoves: (state, action: PayloadAction<AIMove[]>) => {
            state.aiMoves = action.payload;
        },
        incrementMovesCount: (state) => {
            state.movesCount++;
        },
        resetGame: (state) => ({
            ...initialGameState,
            difficulty: state.difficulty,
            mode: state.mode
        }),
    },
});

export const { setTurn, setDifficulty, setMode, setSelected, highlightSquare, resetHighlights, setSquare, setExtraMove, setAIMoves, incrementMovesCount, resetGame } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
