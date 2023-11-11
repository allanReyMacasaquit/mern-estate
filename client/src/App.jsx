import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/about';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Header from './components/Header';
import Private from './components/Private';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Map from './pages/Map';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/sign-up' element={<Signup />} />
				<Route path='/sign-in' element={<Signin />} />
				<Route path='/listing/:id' element={<Listing />} />
				<Route path='/search' element={<Search />} />
				<Route path='/map' element={<Map />} />
				<Route element={<Private />}>
					<Route path='/profile' element={<Profile />} />
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/update-listing/:id' element={<UpdateListing />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
