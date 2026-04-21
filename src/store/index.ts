import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import userReducer from './userSlice';
import demandReducer from './demandSlice';

const persistConfig = {
  key: 'bazaar-live',
  storage,
  whitelist: ['user', 'products', 'demands'], // Only persist these reducers
};

const rootReducer = combineReducers({
  products: productReducer,
  user: userReducer,
  demands: demandReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
