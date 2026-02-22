import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './slices/hotelSlice';

export const store = configureStore({
  reducer: {
    hotel: hotelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
