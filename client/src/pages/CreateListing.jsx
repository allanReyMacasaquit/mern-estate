import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase.js';
import { BarLoader } from 'react-spinners';

const CreateListingForm = () => {
	let [loading, setLoading] = useState(false);
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [formData, setFormData] = useState({
		// name: '',
		// description: '',
		// address: '',
		// regularPrice: 0,
		// discountPrice: 0,
		// bathrooms: 0,
		// bedrooms: 0,
		// furnished: false,
		// parking: false,
		// type: '',
		// offer: false,
		imageUrls: [],
	});

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

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		});
	};

	return (
		<main className='max-w-5xl mx-auto shadow-lg mt-5'>
			<h1 className='bg-gradient-to-l from-blue-500 to-green-500 drop-shadow-md tracking-widest uppercase text-center my-2 text-2xl shadow-lg p-7'>
				Create listings
			</h1>
			<form
				onSubmit={handleSubmit}
				className=' bg-slate-100 flex flex-col sm:flex-row'
			>
				<div className='flex flex-col flex-1'>
					<div>
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
										delete
									</button>
								</div>
							</div>
						))}
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
