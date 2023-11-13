import { useState } from 'react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import './styles/styles.css';
import LoadingScreen from './components/LoadingScreen';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => setIsLoading(false);

    return (
        <div>
            {isLoading && <LoadingScreen />}
            <GameControls />
            <GameBoard />
        </div>
    );
}

export default App;
