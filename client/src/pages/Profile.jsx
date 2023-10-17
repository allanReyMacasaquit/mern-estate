import { useSelector } from 'react-redux';

export default function Profile() {
	const { user } = useSelector((state) => state.user);
	const current = user?.user?.user;
	return (
		<div className='max-w-lg p-3 mx-auto '>
			<h1 className='text-3xl uppercase text-center mt-7 text-slate-700 font-semibold'>
				profile
			</h1>
			<form className='flex flex-col gap-4'>
				<img
					className='rounded-full object-cover h-24 w-24 mt-4 self-center cursor-pointer'
					src={current.photo}
					alt='profile'
				/>
				<input
					type='text'
					id='username'
					placeholder='username'
					className='border p-3 rounded-lg'
				/>
				<input
					type='email'
					id='email'
					placeholder='email'
					className='border p-3 rounded-lg'
				/>
				<input
					type='password'
					id='password'
					placeholder='password'
					className='border p-3 rounded-lg'
				/>
				<button className='uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80'>
					update
				</button>
			</form>
			<div className='flex justify-between mt-5'>
				<span className='text-red-700 cursor-pointer'>Delete Account</span>
				<span className='text-red-700 cursor-pointer'>Sign out</span>
			</div>
		</div>
	);
}
