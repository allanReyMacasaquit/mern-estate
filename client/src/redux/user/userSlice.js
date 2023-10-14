import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: null, // Initially, the user is not logged in
	error: null, // To store any login errors
	loading: false, // To track loading state
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Reducer for handling a successful login
		signInSuccess: (state, action) => {
			state.user = action.payload;
			state.error = null;
			state.loading = false;
		},
		// Reducer for handling a login error
		signInFailure: (state, action) => {
			state.user = null;
			state.error = action.payload;
			state.loading = false;
		},
		// Reducer for setting the loading state
		signInStart: (state) => {
			state.loading = true;
			state.error = null;
		},
	},
});

// Export the actions
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export const userReducer = userSlice.reducer;
