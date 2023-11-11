import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import ListingItem from './ListingItem';

export default function Search() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState([]);
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
			setListings(data);
			setLoading(false);
		};

		fetchListings();
	}, [location.search]);
	return (
		<main>
			<div className='flex flex-col lg:flex-row overflow-x-hidden '>
				<div className='lg:w-1/4 border-b-2 border-r-2 lg:min-h-screen '>
					<form onSubmit={handleSubmit} className='flex flex-col m-4'>
						<div className=' flex mt-4 gap-2 items-center'>
							<span className='whitespace-nowrap tracking-widest font-semibold'>
								Search Term:
							</span>

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
							<span>Category:</span>
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
							<span>Type:</span>
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
								<span className='text-red-700'> Offer:</span>
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
							<span>Amenities:</span>
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
							<span className='text-lg mr-2 tracking-widest font-semibold'>
								Sort:
							</span>
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
				<div className='flex-1 lg:w-3/4 flex-col mt-5  text-2xl tracking-widest drop-shadow-lg'>
					<div className='text-center bg-slate-100 border-b pb-5'>
						<h1 className='pt-4 text-2xl lg:text-4xl tracking-widest'>
							New Listings
						</h1>
					</div>
					<div className=''>
						{!loading && listings.length === 0 && (
							<p className='text-2xl text-red-700'>No Listings Found!</p>
						)}
						{loading && (
							<div className='flex flex-col items-center'>
								<FadeLoader
									height={15}
									width={5}
									radius={2}
									loading={loading}
								/>
								<p className='text-2xl text-center text-slate-700'>
									Loading...
								</p>
							</div>
						)}
					</div>
					<div className='m-2'>
						{!loading &&
							listings &&
							listings.map((listing) => (
								<div key={listing._id} className='shadow-lg'>
									<ListingItem listing={listing} />
								</div>
							))}
					</div>
				</div>
			</div>
		</main>
	);
}
