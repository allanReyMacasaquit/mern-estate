import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
	const [searchTerm, setSearchTerm] = useState('');
	const user = useSelector((state) => state.user);
	const current = user?.user?.user?.user;

	const navigate = useNavigate();
	const location = useLocation();

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		setSearchTerm(urlParams.get('searchTerm') || '');
	}, [location.search]);

	return (
		<header className='bg-slate-200 shadow-lg'>
			<div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
				<Link to='/'>
					<h1 className='font-bold text-sm sm:text-xl flex flex-wrap cursor-pointer'>
						<span className='text-slate-500'>Management</span>
						<span className='text-slate-700'>RealEstate</span>
					</h1>
				</Link>

				<form
					onSubmit={handleSearchSubmit}
					className='bg-slate-100 rounded-lg flex items-center p-1 lg:p-2'
				>
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						name='search'
						className='bg-transparent focus:outline-none w-24 sm:w-64'
						type='text'
						placeholder='Search...'
					/>
					<button>
						<FaSearch className='text-slate-600 cursor-pointer' />
					</button>
				</form>
				<ul className=' flex justify-center items-center gap-7'>
					<Link to='/'>
						<li className='hidden lg:inline text-slate-700 hover:underline cursor-pointer'>
							Home
						</li>
					</Link>
					<Link to='about'>
						<li className='hidden lg:inline text-slate-700 hover:underline cursor-pointer'>
							About
						</li>
					</Link>
					<>
						<Link to='/profile'>
							{current ? (
								<div className='flex justify-center items-center'>
									<img
										className='rounded-full object-cover mr-2 h-10 w-10'
										src={current?.photo}
										alt='profile'
										title='profile'
									/>

									{current?.username && (
										<span className='mr-4 capitalize'>
											{current.username
												.split(' ') // Split the full name into an array of words
												.map((word, index) =>
													index === 0 ? word.charAt(0) : word
												) // Keep the first character of the first word and the complete last name
												.join('')}
										</span>
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
