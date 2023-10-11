import { Link } from 'react-router-dom';

export default function Signup() {
	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
			<form className='flex flex-col gap-4'>
				<input
					type='text'
					placeholder='username'
					id='username'
					className='p-3 border rounded-lg'
				/>
				<input
					type='email'
					placeholder='email'
					id='email'
					className='p-3 border rounded-lg'
				/>
				<input
					type='password'
					placeholder='password'
					id='password'
					className='p-3 border rounded-lg'
				/>
				<button className='bg-slate-700 p-3 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>
					Sign Up
				</button>
			</form>
			<div className='mt-5 flex gap-2'>
				<p>Have an account?</p>
				<Link to='/sign-in'>
					<span className='text-blue-700'>Sign in</span>
				</Link>
			</div>
		</div>
	);
}
