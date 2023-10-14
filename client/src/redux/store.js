import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { userReducer } from './user/userSlice.js';

const store = configureStore({
	reducer: {
		user: userReducer, // Add your userSlice reducer here
		// Add other reducers if you have them
	},

	middleware: getDefaultMiddleware({
		serializableCheck: false,
	}),
});

export default store;
