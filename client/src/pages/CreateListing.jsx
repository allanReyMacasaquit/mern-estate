import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase.js';
import { BarLoader, BeatLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListingForm = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		address: '',
		regularPrice: 70,
		discountPrice: 0,
		bathrooms: 1,
		bedrooms: 1,
		furnished: false,
		parking: false,
		offer: false,
		category: 'studio',
		type: 'rent',
		imageUrls: [],
	});

	const { user } = useSelector((state) => state.user);
	const current = user?.user?.user;
	const navigate = useNavigate();

	const handleImageListingUpload = () => {
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setLoading(true);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setLoading(false);
				})
				.catch((err) => {
					setImageUploadError(
						'Image upload failed (2MB max per image size)',
						err
					);
					setLoading(false);
				});
		} else {
			setImageUploadError('You can only upload 6 images per listing');
			setLoading(false);
		}
	};
	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app); // Create a reference to Firebase storage.
			const filename = new Date().getTime() + file.name; // Generate a unique filename using the timestamp and the original file name.
			const storageRef = ref(storage, filename); // Create a storage reference with the generated filename.
			const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file to storage using uploadBytesResumable.

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate the upload progress.
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					reject(error);
				},
				() => {
					console.log('Upload completed');
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						resolve(downloadUrl);
					});
				}
			);
		});
	};
	useEffect(() => {
		if (imageUploadError) {
			setTimeout(() => {
				setImageUploadError(false);
			}, 4000);
		}
	}, [imageUploadError]);

	const handleInputChange = (e) => {
		if (
			e.target.id === 'detached-house' ||
			e.target.id === 'semi-detached' ||
			e.target.id === 'apartment' ||
			e.target.id === 'studio'
		) {
			setFormData({
				...formData,
				category: e.target.id,
			});
		}

		if (e.target.id === 'sale' || e.target.id === 'rent') {
			setFormData({
				...formData,
				type: e.target.id,
			});
		}

		if (
			e.target.id === 'parking' ||
			e.target.id === 'furnished' ||
			e.target.id === 'offer'
		) {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
		}

		if (
			e.target.type === 'number' ||
			e.target.type === 'text' ||
			e.target.type === 'textarea'
		) {
			setFormData({
				...formData,
				[e.target.id]: e.target.value,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.imageUrls.length < 1)
			return setError('You must upload at least one image');
		if (formData.regularPrice < formData.discountPrice)
			return setError('Discounted Price must be Lower than the regular Price.');
		try {
			setCreateLoading(true);
			setError(false);
			const res = await fetch('/api/listing/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					userRef: current._id,
				}),
			});

			const data = await res.json();

			if (data.success === false) {
				setError(data.message);
				setCreateLoading(false);
				return;
			}
			if (data) {
				setTimeout(() => {
					setSuccess(true);
					setCreateLoading(false);
				}, 3000);
			}
			setTimeout(() => {
				navigate(`/listing/${data._id}`);
			}, 4000);
		} catch (error) {
			setError(error.message);
			setCreateLoading(false);
		}
	};
	useEffect(() => {
		if (success || error) {
			setTimeout(() => {
				setSuccess(false);
				setError(false);
			}, 5000);
		}
	}, [success, error]);

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		});
	};

	return (
		<main className='max-w-6xl mx-auto shadow-lg'>
			<h1 className='bg-gradient-to-l from-blue-500 to-green-500 drop-shadow-md tracking-widest uppercase text-center text-2xl sm:mt-5 shadow-lg p-7'>
				Create listings
			</h1>
			<form
				onSubmit={handleSubmit}
				className=' bg-slate-100 flex flex-col sm:flex-row'
			>
				<div className='flex flex-col flex-1'>
					<div className='flex justify-between items-center p-4'>
						<span className='mt-10 pr-3 inline-block h-[60px] min-h-[1em] bg-gradient-to-l from-blue-500 to-green-500 rounded-lg'></span>
						<div className='flex gap-2 mt-10'>
							<input
								onChange={handleInputChange}
								checked={formData.category === 'detached-house'}
								type='checkbox'
								id='detached-house'
								className='w-5'
							/>
							<span className='text-sm'>Detached House</span>
						</div>
						<div className='flex gap-2 mt-10'>
							<input
								onChange={handleInputChange}
								checked={formData.category === 'semi-detached'}
								type='checkbox'
								id='semi-detached'
								className='w-5'
							/>
							<span className='text-sm'>Semi-Detached</span>
						</div>
						<div className='flex gap-2 mt-10'>
							<input
								onChange={handleInputChange}
								checked={formData.category === 'apartment'}
								type='checkbox'
								id='apartment'
								className='w-5'
							/>
							<span className='text-sm'>Apartment</span>
						</div>
						<div className='flex gap-2 mt-10'>
							<input
								onChange={handleInputChange}
								checked={formData.category === 'studio'}
								type='checkbox'
								id='studio'
								className='w-5'
							/>
							<span className='text-sm'>Studio</span>
						</div>
						<span className='mt-10 pr-3 inline-block h-[60px] min-h-[1em] bg-gradient-to-l from-blue-500 to-green-500 rounded-lg'></span>
					</div>
					<div>
						<div className='p-4'>
							<div className='mt-3'>
								<label htmlFor='name' className='text-gray-500'>
									Name
								</label>
								<input
									type='text'
									id='title'
									name='title'
									maxLength={50}
									minLength={10}
									placeholder='type your title here...'
									defaultValue={formData.title}
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
									defaultValue={formData.description}
									onChange={handleInputChange}
									required
									className='p-2 border border-gray-700 rounded-lg w-full'
								/>
							</div>
							<div className='mt-2'>
								<label htmlFor='name' className='text-gray-500'>
									Address
								</label>
								<input
									type='text'
									id='address'
									name='address'
									placeholder='type your address here...'
									defaultValue={formData.address}
									onChange={handleInputChange}
									required
									className='p-2 border border-gray-700 rounded-lg w-full'
								/>
							</div>
							<div className='flex items-center gap-4'>
								<div className='flex gap-2 mt-10'>
									<input
										onChange={handleInputChange}
										checked={formData.type === 'sale'}
										type='checkbox'
										id='sale'
										className='w-5'
									/>
									<span>Sell</span>
								</div>
								<span className='mt-10 pr-3 inline-block h-[40px] min-h-[1em] bg-gradient-to-l from-blue-500 to-green-500 rounded-lg'></span>
								<div className='flex gap-2 mt-10'>
									<input
										onChange={handleInputChange}
										checked={formData.type === 'rent'}
										type='checkbox'
										id='rent'
										className='w-5'
									/>
									<span>Rent</span>
								</div>
							</div>
							<div className='flex gap-2 mt-10'>
								<input
									onChange={handleInputChange}
									checked={formData.furnished}
									type='checkbox'
									id='furnished'
									className='w-5'
								/>
								<span>Furnished</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input
									onChange={handleInputChange}
									checked={formData.parking}
									type='checkbox'
									id='parking'
									className='w-5'
								/>
								<span>Parking Spot</span>
							</div>
							<div className='flex gap-2 mt-3'>
								<input
									onChange={handleInputChange}
									checked={formData.offer}
									type='checkbox'
									id='offer'
									className='w-5'
								/>
								<span>Offer</span>
							</div>
							<div className='flex flex-wrap gap-5 items-center '>
								<div className='flex gap-2 mt-8'>
									<input
										onChange={handleInputChange}
										value={formData.bedrooms}
										type='number'
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
										onChange={handleInputChange}
										value={formData.bathrooms}
										type='number'
										id='bathrooms'
										min={1}
										max={10}
										className='w-12 h-12 text-center border border-gray-700 rounded-lg  shadow-lg'
									/>
									<span className='mt-2 text-sm text-gray-600 p-2'>
										Bathroom/s
									</span>
								</div>
							</div>
							<div className='flex items-center'>
								<div className='flex items-center'>
									<div className=' mt-5'>
										<input
											disabled={formData.offer}
											onChange={handleInputChange}
											value={formData.regularPrice}
											min={70}
											max={1000000}
											type='number'
											id='regularPrice'
											className='w-24 h-12 text-center text-lg border border-gray-700 rounded-lg  shadow-lg'
										/>
									</div>
									<div className='mt-5 p-3'>
										<p className='text-sm text-red-800'>Regular Price</p>
										<span>($/month)</span>
									</div>
								</div>
								{formData.offer && (
									<div className='flex items-center '>
										<div className=' mt-5'>
											<input
												onChange={handleInputChange}
												value={formData.discountPrice}
												min={0}
												max={3000000}
												type='number'
												id='discountPrice'
												className='w-24 h-12 text-center bg-orange-400 opacity-90 text-xl text-white border border-gray-700 rounded-lg  shadow-lg'
											/>
										</div>
										<div className='mt-5 p-3'>
											<p className='text-sm text-red-800'>Discounted Price</p>
											<span>($/month)</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='p-4 mt-2 sm:mt-8 flex-1'>
					<div className='flex items-center'>
						<h1 className='font-semibold'>Images:</h1>
						<p className='p-2 font-light text-gray-700'>
							The first upload image will be your cover picture (max: 6).
						</p>
					</div>
					<div className='flex items-center '>
						<div className='flex items-center '>
							<div>
								<input
									onChange={(e) => setFiles(e.target.files)}
									id='images'
									type='file'
									accept='image/*'
									multiple
									className='p-3 border border-gray-300 rounded-lg w-full'
								/>
							</div>

							<div className='p-2'>
								<button
									disabled={loading}
									onClick={handleImageListingUpload}
									type='button'
									className='uppercase bg-blue-500 hover:shadow-lg rounded-lg hover:opacity-95'
								>
									<p className='text-white px-5 border border-gray-500 rounded-lg w-full tracking-widest'>
										{loading ? (
											<BarLoader
												height={10}
												color='white'
												width={70}
												loading={true}
											/>
										) : (
											'Upload'
										)}
									</p>
								</button>
							</div>
						</div>
					</div>

					<p className='text-red-700'>
						{imageUploadError ? imageUploadError : ''}
					</p>

					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, i) => (
							<div key={url} className='mt-2'>
								<div className='flex justify-between py-4 px-3 border border-slate-700 rounded-lg'>
									<img
										src={url}
										alt='Image listing'
										className='h-20 w-30 object-cover rounded-lg drop-shadow-2xl  border border-slate-700'
									/>
									<button
										onClick={() => handleRemoveImage(i)}
										type='button'
										className='text-red-600 bg-red-100 h-20 w-20 hover:bg-red-300 rounded-lg hover:text-white border border-h uppercase tracking-widest'
									>
										<p className='text-sm uppercase'>delete</p>
									</button>
								</div>
							</div>
						))}
					<div>
						<button
							disabled={createLoading}
							type='submit'
							className='uppercase mt-4  border w-full bg-green-600 text-white text-center p-3 rounded-lg hover:opacity-95 disabled:opacity-75'
						>
							<div className='tracking-widest'>
								{createLoading ? (
									<BeatLoader color='white' />
								) : (
									'Create Listing'
								)}
							</div>
						</button>
					</div>
					<div className='text-center'>
						{error && <p className='mt-5 text-red-700'>{error}</p>}
					</div>
					<div className='text-center'>
						{success && (
							<p className='mt-5 font-semibold text-lg text-green-700'>
								Listing has been successfully created!
							</p>
						)}
					</div>
				</div>
			</form>
		</main>
	);
};

export default CreateListingForm;
