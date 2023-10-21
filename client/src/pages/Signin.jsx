import { useState } from 'react'; // Importing React dependencies for state management
import { Link, useNavigate } from 'react-router-dom'; // Importing React Router for navigation
import { useDispatch, useSelector } from 'react-redux';
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';
import { useEffect } from 'react';

export default function Signin() {
	// State to manage form data
	const [formData, setFormData] = useState({});
	const { loading, error } = useSelector((state) => state.user);
	const [errorPage, setErrorPage] = useState(false);

	// Get a navigation function for redirects
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Function to handle user input changes and update the form data state
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	// Handle form submission, fetch data, and process the response
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(signInStart());
			// Send a POST request to the server
			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			// Parse the response data as JSON
			const data = await res.json();

			// Check if the signup was not successful
			if (data.success === false) {
				setErrorPage(true);
				dispatch(signInFailure(data.message)); // Dispatch signInFailure with the error message
				return;
			}

			dispatch(signInSuccess(data));
			navigate('/'); // Redirect to home page
		} catch (error) {
			// Handle errors from the fetch request
			console.error('An error occurred:', error);
			dispatch(
				signInFailure(
					'An error occurred while making the request. Please try again later'
				)
			);
		}
	};
	useEffect(() => {
		if (errorPage) {
			setTimeout(() => {
				setErrorPage(false);
			}, 2000);
		}
	}, [errorPage]);

	return (
		<div className='mt-24 p-3 max-w-lg mx-auto border border-slate-200 shadow-lg rounded-lg'>
			<h1 className='text-center text-3xl  my-8'>Sign In</h1>

			{/* Form for user signup */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					type='email'
					placeholder='email'
					id='email'
					className='p-3 border rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='password'
					placeholder='password'
					id='password'
					className='p-3 border rounded-lg'
					onChange={handleChange}
				/>

				<button
					disabled={loading}
					className='bg-slate-700 p-3 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80'
				>
					{loading ? 'Loading...' : 'Sign In'}
				</button>
				<div className='flex justify-center '>
					{errorPage && <p className='text-red-500 '>User not Found!</p>}
				</div>
				<OAuth />
			</form>

			{/* Link to sign-in page */}
			<div className='mt-5 flex gap-2'>
				<p>Dont have an account?</p>
				<Link to='/sign-up'>
					<span className='text-blue-700 capitalize'>sign up</span>
				</Link>
			</div>

			{/* Display error messages if there are any */}
			<div className='flex justify-center '>
				{error && (
					<p className='text-red-500 mt-5 text-lg p-2 rounded-lg uppercase  shadow-sm shadow-slate-500 font-bold'>
						{error}
					</p>
				)}
			</div>
		</div>
	);
}
