import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/bundle';

import ClipLoader from 'react-spinners/ClipLoader';

export default function Listing() {
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState({});
	const [errorMessage, setErrorMessage] = useState('');
	const params = useParams();
	const [images, setImages] = useState([]);

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
		</main>
	);
}
