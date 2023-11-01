import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Search() {
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState([]);
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarSearch, setSidebarSearch] = useState({
		searchTerm: '',
		category: 'all',
		type: 'all',
		parking: false,
		furnished: false,
		offer: false,
		sort: 'created_at',
		order: 'desc',
	});

	console.log(listing);

	const handleChangeSearchTerm = (e) => {
		const { id, value, checked } = e.target;

		if (
			['detached-house', 'semi-detached', 'apartment', 'studio'].includes(id)
		) {
			setSidebarSearch({ ...sidebarSearch, category: id });
		} else if (['all', 'sale', 'rent'].includes(id)) {
			setSidebarSearch({ ...sidebarSearch, type: id });
		} else if (id === 'searchTerm') {
			setSidebarSearch({ ...sidebarSearch, searchTerm: value });
		} else if (['furnished', 'parking', 'offer'].includes(id)) {
			setSidebarSearch({
				...sidebarSearch,
				[id]: checked || checked === 'true',
			});
		} else if (id === 'sort_order') {
			const [sort, order] = value.split('_');
			setSidebarSearch({
				...sidebarSearch,
				sort: sort || 'created_at',
				order: order || 'desc',
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const {
			searchTerm,
			category,
			type,
			offer,
			sort,
			order,
			parking,
			furnished,
		} = sidebarSearch;

		const searchQuery = new URLSearchParams({
			searchTerm,
			category,
			type,
			offer,
			sort,
			order,
			parking,
			furnished,
		}).toString();

		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);

		const defaultValues = {
			searchTerm: '',
			category: 'all',
			type: 'all',
			offer: false,
			furnished: false,
			parking: false,
			sort: 'created_at',
			order: 'desc',
		};

		const parsedValues = {};

		for (const param of Object.keys(defaultValues)) {
			const valueFromURL = urlParams.get(param);

			if (valueFromURL !== null && valueFromURL !== '') {
				if (['offer', 'furnished', 'parking'].includes(param)) {
					parsedValues[param] = valueFromURL === 'true';
				} else {
					parsedValues[param] = valueFromURL;
				}
			}
		}

		if (Object.keys(parsedValues).length > 0) {
			setSidebarSearch({ ...defaultValues, ...parsedValues });
		}

		const fetchListings = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/listing/get?${searchQuery}`);

			const data = await res.json();
			setListing(data);
			setLoading(false);
		};

		fetchListings();
	}, [location.search]);
	return (
		<div className='flex flex-col lg:flex-row '>
			<div className=' border-b-2 border-r-2 lg:min-h-screen'>
				<form onSubmit={handleSubmit} className='flex flex-col m-4'>
					<div className=' flex gap-2 items-center'>
						<label className='whitespace-nowrap tracking-widest font-semibold'>
							Search Term:
						</label>
						<input
							onChange={handleChangeSearchTerm}
							value={sidebarSearch.searchTerm}
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
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.category === 'detached-house'}
							type='checkbox'
							id='detached-house'
							className='rounded-lg w-5 h-5'
						/>
						<span>Semi</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.category === 'semi-detached'}
							type='checkbox'
							id='semi-detached'
							className='rounded-lg w-5 h-5'
						/>
						<span>Apartment</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.category === 'apartment'}
							type='checkbox'
							id='apartment'
							className='rounded-lg w-5 h-5'
						/>
						<span>Studio</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.category === 'studio'}
							type='checkbox'
							id='studio'
							className='rounded-lg w-5 h-5'
						/>
					</div>

					<div className='my-2 text-lg tracking-widest font-semibold'>
						<label>Type:</label>
					</div>

					<div className='flex items-center gap-4 flex-wrap'>
						<span>All</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.type === 'all'}
							type='checkbox'
							id='all'
							className='rounded-lg w-5 h-5'
						/>
						<span>Sale</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.type === 'sale'}
							type='checkbox'
							id='sale'
							className='rounded-lg w-5 h-5'
						/>
						<span>Rent</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.type === 'rent'}
							type='checkbox'
							id='rent'
							className='rounded-lg w-5 h-5'
						/>
					</div>
					<div className='my-5 text-lg tracking-widest'>
						<div className='flex items-center gap-4 flex-wrap '>
							<label className='text-red-700'>Offer:</label>

							<span className='shadow-sm px-2 rounded-lg shadow-red-700'>
								Discounted Price
							</span>
							<input
								onChange={handleChangeSearchTerm}
								checked={sidebarSearch.offer}
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
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.parking}
							type='checkbox'
							id='parking'
							className='rounded-lg w-5 h-5'
						/>
						<span>Furnished</span>
						<input
							onChange={handleChangeSearchTerm}
							checked={sidebarSearch.furnished}
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
							onChange={handleChangeSearchTerm}
							defaultValue={'created_at_desc'}
							id='sort_order'
							className='p-2 rounded-lg border border-slate-700'
						>
							<option value='regularPrice_desc'>Highest to Lowest</option>
							<option value='regularPrice_asc'>Lowest to Highest</option>
							<option value='createdAt_desc'>Latest</option>
							<option value='createdAt_asc'>Oldest</option>
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
