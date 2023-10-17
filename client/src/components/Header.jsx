import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
	const user = useSelector((state) => state.user);
	const current = user?.user?.user?.user;
	console.log(current?.photo);
	return (
		<header className='bg-slate-200 shadow-md'>
			<div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
				<Link to='/'>
					<h1 className='font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer'>
						<span className='text-slate-500'>Management</span>
						<span className='text-slate-700'>RealEstate</span>
					</h1>
				</Link>

				<form className='bg-slate-100 rounded-lg flex items-center p-1 sm:p-2'>
					<input
						name='search'
						className='bg-transparent focus:outline-none w-24 sm:w-64'
						type='text'
						placeholder='Search...'
					/>
					<FaSearch className='text-slate-600 cursor-pointer' />
				</form>
				<ul className=' flex justify-center items-center gap-7'>
					<Link to='/'>
						<li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
							Home
						</li>
					</Link>
					<Link to='about'>
						<li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
							About
						</li>
					</Link>
					<>
						<Link to='/profile'>
							{current ? (
								<div className='flex justify-center items-center'>
									<img
										className='rounded-full object-cover h-10 w-10'
										src={current?.photo}
										alt='profile'
										title='profile'
									/>

									{current?.username && (
										<span className='mx-3'>{current?.username}</span>
									)}
								</div>
							) : (
								<li className='text-slate-700 hover:underline cursor-pointer bg-slate-50 px-2 py-1'>
									Sign In
								</li>
							)}
						</Link>
					</>
				</ul>
			</div>
		</header>
	);
}
