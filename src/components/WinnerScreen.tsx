import { resetGame } from '../redux/reducers/gameSlice';
import { getMode, getWinner } from '../redux/selectors';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { getPlayerString } from '../utils/ui';
import '../styles/endgame.css';

export const WinnerScreen = () => {
    const dispatch = useAppDispatch();
    const winner = useAppSelector(getWinner);
    const mode = useAppSelector(getMode);

    return (
        winner && (
            <div className="overlay">
                <div className="overlay-content">
                    <div className="overlay-box">
                        <p className="message">{getPlayerString(winner!, mode)} WON!</p>
                        <button className="restart-button" onClick={() => dispatch(resetGame())}>
                            Restart game
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default WinnerScreen;
