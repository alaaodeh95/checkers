import { MAX_BOARD, MIN_BOARD } from '../constants/constants';
import { Difficulty, Player } from '../types/gameTypes';

export const isInRange = (cords: [number, number]) => cords[0] >= MIN_BOARD && cords[0] <= MAX_BOARD && cords[1] <= MAX_BOARD && cords[1] >= MIN_BOARD;
export const isSameCords = (x: [number, number], y: [number, number]) => x[0] === y[0] && x[1] === y[1];
export const switchPlayers = (player: Player) => (player === Player.Player1 ? Player.Player2 : Player.Player1);
export const difficultyToDepth = (difficulty: Difficulty) => {
    switch (difficulty) {
        case Difficulty.Easy:
            return 2;
        case Difficulty.Medium:
            return 4;
        case Difficulty.Hard:
            return 6;
    }
};
export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
