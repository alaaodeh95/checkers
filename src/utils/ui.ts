import { Mode, Player } from '../types/gameTypes';

export const getPlayerString = (turn: Player, mode: Mode) => (turn === Player.Player1 ? 'Player 1' : mode === Mode.OnePlayer ? 'Bot' : 'Player 2');
