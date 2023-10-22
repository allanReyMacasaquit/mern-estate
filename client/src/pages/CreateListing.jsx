import { useState } from 'react';

const CreateListingForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		address: '',
		regularPrice: 0,
		discountPrice: 0,
		bathrooms: 0,
		bedrooms: 0,
		furnished: false,
		parking: false,
		type: '',
		offer: false,
		imageUrls: [],
	});

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission, e.g., send data to the server
	};

	return (
		<main className='max-w-5xl mx-auto shadow-lg mt-5'>
			<h1 className='bg-slate-100 drop-shadow-md tracking-widest uppercase text-center my-2 text-2xl shadow-lg p-7'>
				Create listings
			</h1>
			<form
				onSubmit={handleSubmit}
				className=' bg-slate-100 flex flex-col sm:flex-row'
			>
				<div className='flex flex-col flex-1'>
					<div className='md:flex'>
						<div className='p-4'>
							<div className='mt-3'>
								<label htmlFor='name' className='text-gray-500'>
									Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									maxLength={32}
									minLength={10}
									placeholder='type your name here...'
									defaultValue={formData.name}
									onChange={handleInputChange}
									required
									className='p-2 border border-gray-700 rounded-lg w-full'
								/>
							</div>
							<div className='mt-3'>
								<label htmlFor='name' className='text-gray-500'>
									Description
								</label>
								<textarea
									type='text'
									id='description'
									name='description'
									placeholder='type your description here...'
									defaultValue={formData.name}
									onChange={handleInputChange}
									required
									className='p-2 border border-gray-700 rounded-lg w-full'
								/>
							</div>
							<div className='mt-2'>
								<label htmlFor='name' className='text-gray-500'>
									Addrees
								</label>
								<input
									type='text'
									id='address'
									name='address'
									placeholder='type your address here...'
									defaultValue={formData.name}
									onChange={handleInputChange}
									required
									className='p-2 border border-gray-700 rounded-lg w-full'
								/>
							</div>
							<div className='flex gap-2 mt-10'>
								<input type='checkbox' id='sale' className='w-5' />
								<span>Sell</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input type='checkbox' id='rent' className='w-5' />
								<span>Rent</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input type='checkbox' id='furnished' className='w-5' />
								<span>Furnished</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input type='checkbox' id='parking' className='w-5' />
								<span>Parking Spot</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input type='checkbox' id='offer' className='w-5' />
								<span>Offer</span>
							</div>
							<div className='flex flex-wrap gap-5 items-center '>
								<div className='flex gap-2 mt-8'>
									<input
										type='number'
										defaultValue={0}
										id='bedrooms'
										min={1}
										max={10}
										className='w-12 h-12 text-center border border-gray-700 rounded-lg shadow-lg'
									/>
									<span className='mt-2 text-sm text-gray-600 p-2 '>
										Bedroom/s
									</span>
								</div>
								<div className='flex gap-2 mt-8'>
									<input
										type='number'
										defaultValue={0}
										id='bathrooms'
										min={1}
										max={10}
										className='w-12 h-12 text-center border border-gray-700 rounded-lg  shadow-lg'
									/>
									<span className='mt-2 text-sm text-gray-600 p-2'>Bath/s</span>
								</div>
							</div>
							<div className='flex items-center'>
								<div className=' mt-5'>
									<input
										type='number'
										defaultValue={0}
										id='regular-price'
										min={500000}
										max={3000000}
										className='w-24 h-12 text-center border border-gray-700 rounded-lg  shadow-lg'
									/>
								</div>
								<div className='mt-5 p-3'>
									<p className='text-sm text-red-800'>Regular Price</p>
									<span>($/month)</span>
								</div>
							</div>
							<div className='flex items-center'>
								<div className=' mt-5'>
									<input
										type='number'
										defaultValue={0}
										id='discounted-price'
										min={500000}
										max={3000000}
										className='w-24 h-12 text-center border border-gray-700 rounded-lg  shadow-lg'
									/>
								</div>
								<div className='mt-5 p-3'>
									<p className='text-sm text-red-800'>Discounted Price</p>
									<span>($/month)</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='p-4 mt-2 sm:mt-8'>
					<div className='flex items-center'>
						<h1 className='font-semibold'>Images:</h1>
						<p className='p-2 font-light text-gray-700'>
							The first upload image will be your cover picture (max: 6).
						</p>
					</div>
					<div className='mt-2 flex items-center'>
						<div className='flex items-center'>
							<div>
								<input
									id='images'
									type='file'
									accept='image/*'
									multiple
									className='p-3 border border-gray-300 rounded-lg w-full'
								/>
							</div>

							<div className='p-5'>
								<button
									type='submit'
									className='uppercase bg-gradient-to-l from-blue-500 to-green-500 hover:border-green-500 hover:shadow-lg rounded-lg hover:opacity-95'
								>
									<p className='text-white p-4 rounded-lg w-full tracking-widest'>
										Upload
									</p>
								</button>
							</div>
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='uppercase mt-4  border w-full bg-green-600 text-white text-center p-3 rounded-lg hover:opacity-95 disabled:opacity-75'
						>
							<div className='tracking-widest'>Create listings</div>
						</button>
					</div>
				</div>
			</form>
		</main>
	);
};

export default CreateListingForm;
