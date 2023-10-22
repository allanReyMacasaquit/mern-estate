import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/about';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Header from './components/Header';
import Private from './components/Private';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/sign-up' element={<Signup />} />
				<Route path='/sign-in' element={<Signin />} />
				<Route element={<Private />}>
					<Route path='/profile' element={<Profile />} />
					<Route path='/create-listing' element={<CreateListing />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
