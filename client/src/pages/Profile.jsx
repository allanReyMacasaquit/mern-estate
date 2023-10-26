import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage'; // Import Firebase storage functions.
import {
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserSuccess,
	signOutUserSuccess,
} from '../redux/user/userSlice.js';
import { useSelector } from 'react-redux'; // Import useSelector from 'react-redux' for accessing the Redux state.
import { useEffect, useRef, useState } from 'react'; // Import useEffect, useRef, and useState from 'react' for managing state and side effects.
import { app } from '../firebase.js'; // Import the Firebase configuration.
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function Profile() {
	const [formData, setFormData] = useState({}); // Initialize state for form data.
	const [fileUploadError, setFileUploadError] = useState(false); // Initialize state for file upload errors.
	const [filePercent, setFilePercent] = useState(0); // Initialize state for file upload progress.
	const [file, setFile] = useState(undefined); // Initialize state for the selected file.
	const fileRef = useRef(null); // Create a ref for the file input element.
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [error, setError] = useState(false);
	const [userListings, setUserListings] = useState([]);
	const { user } = useSelector((state) => state.user); // Use useSelector to access user data from the Redux state.
	const current = user?.user?.user; // Initialize the 'current' variable with user data.
	const dispatch = useDispatch();

	const handleFileUpload = (file) => {
		const storage = getStorage(app); // Create a reference to Firebase storage.
		const filename = new Date().getTime() + file.name; // Generate a unique filename using the timestamp and the original file name.
		const storageRef = ref(storage, filename); // Create a storage reference with the generated filename.
		const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file to storage using uploadBytesResumable.

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate the upload progress.
				setFilePercent(Math.round(progress)); // Update the file upload progress state.
			},
			(error) => {
				// Handle any upload errors here.
				console.error('Upload error:', error);
				setFileUploadError(true); // Set the file upload error state.
			},
			() => {
				// Upload completed successfully.
				console.log('Upload completed');
				getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
					setFormData({ ...formData, photo: downloadUrl }); // Set the 'photo' property in the form data.
				});
			}
		);
	};

	useEffect(() => {
		if (file) {
			handleFileUpload(file); // Trigger the file upload function when the 'file' state changes.
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch(`/api/user/update/${current._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (data.success === false) {
				setError(true);
				setLoading(false);
				dispatch(updateUserFailure(data.message));
				return;
			}
			setTimeout(() => {
				dispatch(updateUserSuccess(data));
			}, 2000);

			setError(false);

			setTimeout(() => {
				setUpdateSuccess(true);
				setLoading(false);
			}, 2000);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	useEffect(() => {
		if (updateSuccess) {
			setTimeout(() => {
				setUpdateSuccess(false);
			}, 3000);
		}
	}, [updateSuccess]);

	useEffect(() => {
		if (filePercent === 100) {
			setTimeout(() => {
				setFilePercent(null);
			}, 2000);
		}
	}, [filePercent]);

	const handleDeleteUser = async () => {
		try {
			setIsDelete(true);
			const res = await fetch(`/api/user/delete/${current._id}`, {
				method: 'DELETE',
			});
			const data = await res.json();

			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			setTimeout(() => {
				dispatch(deleteUserSuccess(data));
				setIsDelete(false);
			}, 2000);
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};
	const handleUserSignOut = async () => {
		try {
			const res = await fetch('/api/auth/signout');

			const data = await res.json();

			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(signOutUserSuccess(data.message));
		} catch (error) {
			error.message;
		}
	};
	const handleShowListings = async () => {
		try {
			const res = await fetch(`/api/user/listings/${current._id}`);

			const data = await res.json();
			setUserListings(data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await res.json();
			if (data.success === false) {
				console.log(data.error);
				return;
			}
			setUserListings((prev) =>
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='mt-24 p-3 max-w-lg mx-auto border border-slate-200 shadow-lg rounded-lg'>
			<h1 className='text-3xl uppercase text-center mt-7 text-slate-700 font-semibold'>
				profile
			</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					onChange={(e) => setFile(e.target.files[0])} // Set the 'file' state when a file is selected.
					type='file'
					ref={fileRef}
					hidden
					accept='image/*'
				/>
				<img
					className='rounded-full object-cover h-24 w-24 mt-4 self-center cursor-pointer'
					src={formData.photo || current.photo}
					alt='profile'
					onClick={() => fileRef.current.click()} // Trigger the file input when the image is clicked.
				/>
				<p className='text-center'>
					{fileUploadError ? (
						<span className='text-red-700'>
							Error Image Upload (Image must be less than 2MB)
						</span>
					) : filePercent > 0 && filePercent < 100 ? (
						<span className='text-slate-700'>
							{`Uploading ${filePercent}%`}
						</span>
					) : filePercent === 100 ? (
						<span className='text-green-700'>Image Successfully Uploaded</span>
					) : (
						''
					)}
				</p>
				<input
					type='text'
					autoComplete='true'
					id='username'
					defaultValue={current.username}
					className='border p-3 rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='email'
					autoComplete='true'
					id='email'
					defaultValue={current.email}
					className='border p-3 rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='password'
					id='password'
					placeholder='password'
					className='border p-3 rounded-lg'
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className='uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80'
				>
					{loading ? 'Loading...' : 'update'}
				</button>
				<Link to='/create-listing'>
					<p className='bg-green-600 text-white p-3 rounded-lg hover:opacity-95 uppercase text-center'>
						create listing
					</p>
				</Link>
			</form>
			<div className='flex justify-between px-3 mt-5'>
				<span
					onClick={handleDeleteUser}
					className='text-red-700 cursor-pointer'
				>
					{isDelete ? 'Deleting...' : 'Delete Account'}
				</span>
				<span
					onClick={handleUserSignOut}
					className='text-red-700 cursor-pointer'
				>
					Sign out
				</span>
			</div>
			{/* Display error messages if there are any */}
			<div className='flex justify-center '>
				{error && (
					<p className='text-red-500 mt-5 text-lg p-2 rounded-lg uppercase  shadow-sm shadow-slate-500 font-bold'>
						{error}
					</p>
				)}
			</div>
			<div className='flex justify-center '>
				{updateSuccess && (
					<p className='text-green-700 mt-5 text-lg p-2 rounded-lg uppercase  shadow-sm shadow-slate-500 font-bold'>
						update successfully!
					</p>
				)}
			</div>
			<div className='shadow-lg rounded-lg'>
				<button
					type='button'
					onClick={handleShowListings}
					className='text-green-700 w-full uppercase'
				>
					show listings
				</button>
			</div>
			<div>
				<div className='flex my-4'>
					<h1>Your listings</h1>
					<svg
						className='w-6 h-6 text-gray-800 dark:text-white mx-4 my-1'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 14 8'
					>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1'
						/>
					</svg>
				</div>
				{userListings &&
					userListings.length > 0 &&
					userListings.map((listing) => (
						<>
							<div
								key={listing._id}
								className='flex flex-col mt-6 bg-slate-200 rounded-lg '
							>
								<Link to={`/listing/${listing._id}`}>
									<img
										className='w-30 mt-8 object-cover py-2 relative'
										src={listing.imageUrls[0]}
										alt='Cover picture'
									/>
								</Link>

								<p className='p-2 absolute truncate font-semibold tracking-widest '>
									{listing.title}
								</p>
								<span className='flex justify-between capitalize p-3 hover:shadow-lg '>
									<p className='hover:bg-green-500 border border-green-700 px-4 text-slate-600 hover:text-white inline hover:cursor-pointer  hover:shadow-green-400 rounded-lg p-1'>
										Edit
									</p>
									<p
										onClick={() => handleListingDelete(listing._id)}
										className='hover:bg-orange-700 text-white bg-red-700 hover:opacity-95 inline hover:cursor-pointer  hover:shadow-red-400 rounded-lg p-1'
									>
										delete
									</p>
								</span>
							</div>
						</>
					))}
			</div>
		</div>
	);
}
