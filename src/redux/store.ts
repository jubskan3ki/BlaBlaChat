import { configureStore } from '@reduxjs/toolkit';
import chanelReducer from './chanel.slice';
import userReducer from './user.slice';
import menuReducer from './menu.slice';

const store = configureStore({
    reducer: {
        chanel: chanelReducer,
        user: userReducer,
        menu: menuReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
