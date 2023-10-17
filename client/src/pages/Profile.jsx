import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../firebase.js';

export default function Profile() {
	const [formData, setFormData] = useState({});
	const [fileUploadError, setfileUploadError] = useState(false);
	const [filePercent, setfilePercent] = useState(0);
	const [file, setFile] = useState(undefined);
	const fileRef = useRef(null);
	const { user } = useSelector((state) => state.user);
	const current = user?.user?.user;

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const filename = new Date().getTime() + file.name; // Use 'file.name' as part of the filename
		const storageRef = ref(storage, filename);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setfilePercent(Math.round(progress));
			},
			(error) => {
				// Handle any upload errors here
				console.error('Upload error:', error);
				setfileUploadError(true);
			},
			() => {
				// Upload completed successfully
				console.log('Upload completed');
				getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
					setFormData({ ...formData, photo: downloadUrl });
				});
			}
		);
	};

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	return (
		<div className='max-w-lg p-3 mx-auto '>
			<h1 className='text-3xl uppercase text-center mt-7 text-slate-700 font-semibold'>
				profile
			</h1>
			<form className='flex flex-col gap-4'>
				<input
					onChange={(e) => setFile(e.target.files[0])}
					type='file'
					ref={fileRef}
					hidden
					accept='image/*'
				/>
				<img
					className='rounded-full object-cover h-24 w-24 mt-4 self-center cursor-pointer'
					src={formData.photo || current.photo}
					alt='profile'
					onClick={() => fileRef.current.click()}
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
