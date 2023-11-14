import { getNumberOfPieces } from '../redux/selectors';
import { useAppSelector } from '../redux/store/hooks';
import '../styles/counter.css'
import { PieceId } from '../types/gameTypes';

const PieceCounter = () => {
    const pieces = useAppSelector(getNumberOfPieces);

    return (
        <div className="piece-counter">
            <div className="piece">
                <img src={'./player1.jpg'} alt="P1" />
                <span>{pieces[PieceId.Player1]}</span>
            </div>
            <div className="piece">
            <img src={'./player1King.jpg'} alt="P1" />
                <span>{pieces[PieceId.Player1King]}</span>
            </div>
            <div className="piece">
            <img src={'./player2.jpg'} alt="P1" />
                <span>{pieces[PieceId.Player2]}</span>
            </div>
            <div className="piece">
            <img src={'./player2King.jpg'} alt="P1" />
                <span>{pieces[PieceId.Player2King]}</span>
            </div>
        </div>
    );
};

export default PieceCounter;
