import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return <div>Home</div>;
}
