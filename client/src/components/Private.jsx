import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function Private() {
	const { user } = useSelector((state) => state.user);
	const currentUser = user?.user?.user;
	return !currentUser ? <Navigate to='/sign-in' replace={true} /> : <Outlet />;
}
