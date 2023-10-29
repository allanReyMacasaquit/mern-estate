import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/bundle';
import {
	FaBath,
	FaBed,
	FaChair,
	// FaMapMarkedAlt,
	FaMapMarkerAlt,
	FaParking,
	FaShare,
} from 'react-icons/fa';

import ClipLoader from 'react-spinners/ClipLoader';

export default function Listing() {
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState({});
	const [errorMessage, setErrorMessage] = useState('');
	const [copied, setCopied] = useState(false);
	// const [contact, setContact] = useState(false);
	const params = useParams();
	const [images, setImages] = useState([]);
	// const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/listing/get/${params.id}`);
				const data = await res.json();

				if (!data) {
					setLoading(false);
					setErrorMessage(data.message);
					return;
				} else {
					setListing(data);
					setImages(data.imageUrls);
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchListing();
	}, [params.id]);

	return (
		<main>
			<div className='text-center flex flex-col'>
				<div>
					{loading && <ClipLoader className='mt-10' size={50} loading={true} />}
				</div>
			</div>

			<div>
				{errorMessage && (
					<p className='text-center mt-60 text-red-700 uppercase text-2xl'>
						{errorMessage}
					</p>
				)}
			</div>
			<div className='drop-shadow-2xl shadow-lg border border-slate-700'>
				{images.length > 0 && (
					<Swiper
						modules={[Navigation, Pagination, Scrollbar, A11y]}
						navigation
						pagination={{ clickable: true }}
						scrollbar={{ draggable: true }}
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<div
									style={{
										height: '640px',
										display: 'flex',
									}}
								>
									<img
										className='object-cover w-full'
										src={image}
										alt={`Image ${index}`}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>

			<div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
				<FaShare
					className='text-slate-500'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
						setCopied(true);
						setTimeout(() => {
							setCopied(false);
						}, 2000);
					}}
				/>
			</div>
			{copied && (
				<p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
					Link copied!
				</p>
			)}
			<div className=' flex flex-col  lg:flex-row max-w-6xl mx-auto justify-around  '>
				<div className='flex flex-1 flex-col  p-3 my-7 gap-4 border rounded-lg shadow-lg border-yellow-400'>
					<div className=' flex flex-col items-center drop-shadow-lg justify-center'>
						<p className='text-2xl bg-yellow-100 rounded-lg shadow-lg p-2 font-semibold'>
							{listing.title}
						</p>
						<p className='text-2xl mt-4 p-2 shadow-lg rounded-lg text-red-700'>
							${listing.offer ? listing.discountPrice : listing.regularPrice}
							{listing.type === 'rent' && ' / month'}
						</p>
					</div>
					<div className=' flex flex-col items-center gap-4'>
						<p className='flex items-center mb-4 gap-2 text-slate-600 '>
							<FaMapMarkerAlt className='text-green-700' />
							{listing.address}
						</p>
						<div className='flex gap-10'>
							<p className='bg-red-900 w-full px-20 flex items-center text-white text-center p-1 rounded-md'>
								{listing.type === 'rent' ? 'For Rent' : 'For Sale'}
							</p>
							<div className='bg-green-900 gap-2 w-full px-20 flex items-center text-white text-center p-1 rounded-md'>
								{listing.offer && (
									<p>${listing.regularPrice - listing.discountPrice}</p>
								)}
								<span>OFF</span>
							</div>
						</div>

						<ul className='text-green-900 mt-6 font-semibold text-sm flex flex-wrap items-center gap-10 '>
							<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
								<FaBed className='text-3xl' />
								{listing.bedrooms > 1
									? `${listing.bedrooms} beds `
									: `${listing.bedrooms} bed `}
							</li>
							<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
								<FaBath className='text-xl' />
								{listing.bathrooms > 1
									? `${listing.bathrooms} baths `
									: `${listing.bathrooms} bath `}
							</li>
							<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
								<FaParking className='text-2xl' />
								{listing.parking ? 'Parking spot' : 'No Parking'}
							</li>
							<li className='flex items-center gap-1 whitespace-nowrap hover:text-green-600'>
								<FaChair className='text-2xl' />
								{listing.furnished ? 'Furnished' : 'Unfurnished'}
							</li>
						</ul>
					</div>
				</div>
				<div className='flex-1 '>
					<p className='text-slate-800 opacity-80 hover:opacity-100 hover:text-blue-950 sm:m-7 border border-yellow-400 rounded-lg shadow-lg tracking-widest p-4 '>
						<span className='font-semibold text-lg'>
							Description: {listing.description}
						</span>
					</p>
				</div>
			</div>
			<div className='flex justify-center  w-full bg-slate-700 p-5'>
				<footer>
					<p className='text-white uppercase cursor-pointer tracking-widest text-lg'>
						contact us
					</p>
				</footer>
			</div>
		</main>
	);
}
