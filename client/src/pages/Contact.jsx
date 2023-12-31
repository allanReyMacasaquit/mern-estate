import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

Contact.propTypes = {
	listing: PropTypes.object.isRequired,
};

export default function Contact({ listing }) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const [message, setMessage] = useState('');
	const [owner, setOwner] = useState(null);
	const [formVisible, setFormVisible] = useState(true);
	const subject = 'Regarding Your Listing';
	const navigate = useNavigate();
	useEffect(() => {
		const fetchOwner = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`);

				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}

				const data = await res.json();

				if (!data) {
					return;
				}
				setOwner(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchOwner();
	}, [listing]);

	const onChangeMessage = (e) => {
		setMessage(e.target.value);
	};

	// Construct the mailto link
	const mailtoLink = `mailto:${owner?.username}?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(message)}`;

	const handleSendMessage = () => {
		setFormVisible(false);
		navigate('/search');
	};

	return (
		<div>
			{formVisible ? (
				<div className='drop-shadow-lg rounded-lg bg-slate-700 absolute top-0 left-0 z-50 border-slate-700'>
					{owner && (
						<p className=' p-4 text-white rounded-t-lg'>
							<span className='font-semibold text-xl mr-4'>Owner:</span>
							<span className='tracking-widest text-lg capitalize'>
								{owner.username.slice(0, 10)}...
							</span>
						</p>
					)}
					<textarea
						className='mt-1 p-2'
						value={message}
						onChange={onChangeMessage}
						name='message'
						id='message'
						cols='45'
						rows='10'
						placeholder='Enter your message here...'
					></textarea>
					<span className='text-white'>
						<Link to={mailtoLink}>
							<div className='p-3 rounded-b-lg  '>
								<p
									onClick={handleSendMessage}
									className='cursor-pointer opacity-80 hover:opacity-100'
								>
									Send Message
								</p>
							</div>
						</Link>
					</span>
				</div>
			) : (
				''
			)}
		</div>
	);
}
