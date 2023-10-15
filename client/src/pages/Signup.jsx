import { useState } from 'react'; // Importing React dependencies for state management
import { Link, useNavigate } from 'react-router-dom'; // Importing React Router for navigation
import OAuth from '../components/OAuth';

export default function Signup() {
	// State to manage form data
	const [formData, setFormData] = useState({});

	// State to manage error messages
	const [error, setError] = useState(null);

	// State to manage loading state
	const [loading, setLoading] = useState(false);

	// Get a navigation function for redirects
	const navigate = useNavigate();

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
			setLoading(true); // Set loading state to true during the fetch request

			// Send a POST request to the server
			const res = await fetch('/api/auth/signup', {
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
				setError(data.message); // Set an error message
				setLoading(false);
				return;
			}

			setLoading(false); // Set loading state back to false
			setError(null); // Clear any previous error messages
			navigate('/sign-in'); // Redirect to the sign-in page after successful signup
		} catch (error) {
			// Handle errors from the fetch request
			console.error('An error occurred:', error);
			setError(
				'An error occurred while making the request. Please try again later'
			);
			setLoading(false);
		}
	};

	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>

			{/* Form for user signup */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					type='text'
					placeholder='username'
					id='username'
					className='p-3 border rounded-lg'
					onChange={handleChange}
				/>
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
					{loading ? 'Loading...' : 'Sign Up'}
				</button>
				<OAuth />
			</form>

			{/* Link to sign-in page */}
			<div className='mt-5 flex gap-2'>
				<p>Have an account?</p>
				<Link to='/sign-in'>
					<span className='text-blue-700 uppercase'>Sign in</span>
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
