export default function Search() {
	return (
		<div className='flex flex-col lg:flex-row '>
			<div className=' border-b-2 border-r-2 lg:min-h-screen'>
				<form className='flex flex-col m-4'>
					<div className=' flex gap-2 items-center'>
						<label className='whitespace-nowrap tracking-widest font-semibold'>
							Search Term:
						</label>
						<input
							id='searchTerm'
							className='p-2 rounded-lg w-full border border-slate-700 '
							type='text'
							placeholder='Search...'
						/>
					</div>
					<div className='my-2 text-lg tracking-widest font-semibold'>
						<label>Category:</label>
					</div>

					<div className='flex items-center gap-4 flex-wrap'>
						<span>Detached</span>
						<input
							type='checkbox'
							id='detached-house'
							className='rounded-lg w-5 h-5'
						/>
						<span>Semi</span>
						<input
							type='checkbox'
							id='semi-detached'
							className='rounded-lg w-5 h-5'
						/>
						<span>Apartment</span>
						<input
							type='checkbox'
							id='apartment'
							className='rounded-lg w-5 h-5'
						/>
						<span>Studio</span>
						<input type='checkbox' id='studio' className='rounded-lg w-5 h-5' />
					</div>

					<div className='my-2 text-lg tracking-widest font-semibold'>
						<label>Type:</label>
					</div>

					<div className='flex items-center gap-4 flex-wrap'>
						<span>Sale</span>
						<input type='checkbox' id='sale' className='rounded-lg w-5 h-5' />
						<span>Rent</span>
						<input type='checkbox' id='rent' className='rounded-lg w-5 h-5' />
					</div>
					<div className='my-5 text-lg tracking-widest'>
						<div className='flex items-center gap-4 flex-wrap '>
							<label className='text-red-700'>Offer:</label>

							<span className='shadow-sm px-2 rounded-lg shadow-red-700'>
								Discounted Price
							</span>
							<input
								type='checkbox'
								id='offer'
								className='rounded-lg w-5 h-5 '
							/>
						</div>
					</div>
					<div className='my-1 text-lg tracking-widest font-semibold'>
						<label>Amenities:</label>
					</div>

					<div className='flex items-center gap-4 flex-wrap'>
						<span>Parking</span>
						<input
							type='checkbox'
							id='parking'
							className='rounded-lg w-5 h-5'
						/>
						<span>Furnished</span>
						<input
							type='checkbox'
							id='furnished'
							className='rounded-lg w-5 h-5'
						/>
					</div>
					<div className='mt-5'>
						<label className='text-lg mr-2 tracking-widest font-semibold'>
							Sort:
						</label>
						<select
							id='sort_order'
							className='p-2 rounded-lg border border-slate-700'
						>
							<option>Highest to Lowest</option>
							<option>Lowest to Highest</option>
							<option>Latest</option>
							<option>Oldest</option>
						</select>
					</div>
					<div className='bg-slate-700 mt-5 text-white p-3 text-center rounded-lg hover:opacity-95'>
						<button className='tracking-widest text-lg'>Search</button>
					</div>
				</form>
			</div>
			<div className='flex m-5 pb-5 text-2xl tracking-widest border-b md:border-b'>
				<div className=''>
					<h1>New Listings</h1>
				</div>
			</div>
		</div>
	);
}
