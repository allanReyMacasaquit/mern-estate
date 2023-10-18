import { useSelector } from 'react-redux'; // Import useSelector from 'react-redux' for accessing the Redux state.
import { useEffect, useRef, useState } from 'react'; // Import useEffect, useRef, and useState from 'react' for managing state and side effects.
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage'; // Import Firebase storage functions.

import { app } from '../firebase.js'; // Import the Firebase configuration.

export default function Profile() {
	const [formData, setFormData] = useState({}); // Initialize state for form data.
	const [fileUploadError, setFileUploadError] = useState(false); // Initialize state for file upload errors.
	const [filePercent, setFilePercent] = useState(0); // Initialize state for file upload progress.
	const [file, setFile] = useState(undefined); // Initialize state for the selected file.
	const fileRef = useRef(null); // Create a ref for the file input element.
	const { user } = useSelector((state) => state.user); // Use useSelector to access user data from the Redux state.
	const current = user?.user?.user; // Initialize the 'current' variable with user data.

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
	}, [file]);

	return (
		<div className='max-w-lg p-3 mx-auto '>
			<h1 className='text-3xl uppercase text-center mt-7 text-slate-700 font-semibold'>
				profile
			</h1>
			<form className='flex flex-col gap-4'>
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
					id='username'
					placeholder='username'
					className='border p-3 rounded-lg'
				/>
				<input
					type='email'
					id='email'
					placeholder='email'
					className='border p-3 rounded-lg'
				/>
				<input
					type='password'
					id='password'
					placeholder='password'
					className='border p-3 rounded-lg'
				/>
				<button className='uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80'>
					update
				</button>
			</form>
			<div className='flex justify-between mt-5'>
				<span className='text-red-700 cursor-pointer'>Delete Account</span>
				<span className='text-red-700 cursor-pointer'>Sign out</span>
			</div>
		</div>
	);
}
