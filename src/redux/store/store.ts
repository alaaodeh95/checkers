import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '../reducers';
import { GameState } from '../../types/gameTypes';

export const createStore = (game: GameState) =>
    configureStore({
        reducer,
        preloadedState: {
            game,
        },
    });

export type AppStore = ReturnType<typeof createStore>;
export type GetState = AppStore['getState'];
export type AppDispatch = AppStore['dispatch'];

export type RootState = ReturnType<GetState>;
export type ActionFn<T = void> = (dispatch: AppDispatch, getState: GetState) => Promise<T> | T;
