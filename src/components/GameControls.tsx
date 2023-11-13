import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { setDifficulty, setMode, resetGame } from '../redux/reducers/gameSlice';
import '../styles/controls.css';
import { Difficulty, Mode } from '../types/gameTypes';
import { getDifficulty, getMode, getTurn } from '../redux/selectors';
import { getPlayerString } from '../utils/ui';

const GameControls: React.FC = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector(getDifficulty);
    const mode = useAppSelector(getMode);
    const turn = useAppSelector(getTurn);

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDifficulty(event.target.value as Difficulty));
    };

    const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setMode(event.target.value as Mode));
    };

    const handleResetGame = () => {
        dispatch(resetGame());
    };

    return (
        <div className="game-controls">
            <div className="player-section">Turn: {getPlayerString(turn, mode)}</div>
            <div className="control-section">
                <select title={'Difficulty'} disabled={mode === Mode.TwoPlayers} value={difficulty} onChange={handleDifficultyChange}>
                    <option value={Difficulty.Easy}>Easy</option>
                    <option value={Difficulty.Medium}>Medium</option>
                    <option value={Difficulty.Hard}>Hard</option>
                </select>
                <select title={'Mode'} value={mode} onChange={handleModeChange}>
                    <option value={Mode.OnePlayer}>Single mode</option>
                    <option value={Mode.TwoPlayers}>Two players</option>
                </select>
                <button onClick={handleResetGame}>Reset</button>
            </div>
        </div>
    );
};

export default GameControls;
