import { useEffect } from 'react';

export default function About() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return <div>about</div>;
}
