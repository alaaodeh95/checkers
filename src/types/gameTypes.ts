export enum Piece {
    Player1 = 'player1',
    Player1King = 'player1King',
    Player2 = 'player2',
    Player2King = 'player2King',
    Null = '',
}

export enum Difficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
}

export enum Mode {
    OnePlayer = 'onePlayer',
    TwoPlayers = 'twoPlayers',
}

export enum Player {
    Player1 = 'player1',
    Player2 = 'player2',
}

export interface Square {
    piece: Piece;
    location: [number, number];
    isHighlighted?: boolean;
}

export interface Moves {
    isKiller?: boolean;
    from: [number, number];
    to: Array<[number, number]>;
}

export interface AIMove {
    from: [number, number];
    to: [number, number];
}

export type Board = Square[][];

export type Node = {
    board: Board;
    currentPlayer: Player;
    moves: AIMove[];
};

export interface GameState {
    board: Board;
    difficulty: Difficulty;
    turn: Player;
    mode: Mode;
    selected: Square | null;
    extraMove: Moves | null;
    aiMoves: AIMove[];
}
