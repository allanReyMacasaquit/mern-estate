import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/about';
import Profile from './pages/profile';
import Signup from './pages/signup';
import Signin from './pages/Signin';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/sign-up' element={<Signup />} />
				<Route path='/sign-in' element={<Signin />} />
			</Routes>
		</BrowserRouter>
	);
}
