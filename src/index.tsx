import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from './redux/store/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { initialGameState } from './redux/reducers/gameSlice';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={createStore(initialGameState)}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
