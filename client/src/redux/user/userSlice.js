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
		},
		// Reducer for handling a successful login
		updateUserSuccess: (state, action) => {
			state.user = action.payload;
			state.error = null;
			state.loading = false;
		},
		// Reducer for handling a login error
		updateUserFailure: (state, action) => {
			state.error = action.payload;
			state.user = null;
			state.loading = false;
		},
		// Reducer for setting the loading state
		updateUserStart: (state) => {
			state.loading = true;
		},
		// Reducer for handling a successful login
		deleteUserSuccess: (state, action) => {
			state.user = action.payload;
			state.error = null;
			state.loading = false;
		},
		// Reducer for handling a login error
		deleteUserFailure: (state, action) => {
			state.error = action.payload;
			state.user = null;
			state.loading = false;
		},
		// Reducer for setting the loading state
		deleteUserStart: (state) => {
			state.loading = true;
		},
		// Reducer for handling a successful login
		signOutUserSuccess: (state, action) => {
			state.user = action.payload;
			state.error = null;
			state.loading = false;
		},
	},
});

// Export the actions
export const {
	signInSuccess,
	signInFailure,
	signInStart,
	updateUserSuccess,
	updateUserFailure,
	updateUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	deleteUserStart,
	signOutUserSuccess,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
