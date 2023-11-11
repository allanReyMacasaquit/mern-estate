import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed, FaChair, FaParking } from 'react-icons/fa';

export default function ListingItem({ listing }) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div className='bg-white shadow-lg hover:shadow-lg rounded-lg w-full'>
			<Link to={`/listing/${listing._id}`}>
				<div className='relative overflow-hidden group rounded-t-lg'>
					<img
						src={listing.imageUrls[0]}
						alt='images'
						className='h-[450px] lg:h-[500px] transition-transform transform-gpu group-hover:scale-105 group-hover:shadow-lg rounded-t-lg border w-full object-cover'
					/>
				</div>
				<div className=' m-8 group-hover:shadow-lg font-semibold'>
					<h1 className=' text-slate-700 text-2xl lg:text-3xl truncate text-center'>
						{listing.title}
					</h1>

					<div className='mt-4 text-slate-500 flex justify-center items-center'>
						<div className='flex px-4'>
							{listing.type === 'rent' ? (
								<span className='text-red-700 shadow-lg p-2 rounded-lg'>
									For Rent
								</span>
							) : (
								<span className='text-green-700 shadow-lg p-2 rounded-lg'>
									For Sale
								</span>
							)}
						</div>
						<p className='text-slate-800'>
							$
							{listing.offer
								? listing.discountPrice.toLocaleString()
								: listing.regularPrice.toLocaleString()}
						</p>
						<p>{listing.type === 'rent' && ' /month'}</p>
					</div>
					<ul className='m-6 text-green-900 font-semibold text-sm flex flex-wrap justify-center items-center gap-5 lg:gap-10 '>
						<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
							<FaBed className='text-3xl lg:text-4xl' />
							{listing.bedrooms > 1
								? `${listing.bedrooms} beds `
								: `${listing.bedrooms} bed `}
						</li>
						<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
							<FaBath className='text-xl lg:text-4xl' />
							{listing.bathrooms > 1
								? `${listing.bathrooms} baths `
								: `${listing.bathrooms} bath `}
						</li>
						<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
							<FaParking className='text-2xl lg:text-4xl' />
							{listing.parking ? 'Parking spot' : 'No Parking'}
						</li>
						<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
							<FaChair className='text-2xl lg:text-4xl' />
							{listing.furnished ? 'Furnished' : 'Unfurnished'}
						</li>
					</ul>
					<div>
						<div className=' pb-4 flex justify-center items-center m-2  py-1'>
							<MdLocationOn className='text-red-500 text-xl lg:text-4xl' />
							<p className='p-2 text-sm '>{listing.address}</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}

ListingItem.propTypes = {
	listing: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		bedrooms: PropTypes.number.isRequired,
		bathrooms: PropTypes.number.isRequired,
		furnished: PropTypes.bool,
		description: PropTypes.string.isRequired,
		parking: PropTypes.bool,
		offer: PropTypes.bool,
		type: PropTypes.string,
		discountPrice: PropTypes.number.isRequired,
		regularPrice: PropTypes.number.isRequired,
		imageUrls: PropTypes.array.isRequired,
	}).isRequired,
};
