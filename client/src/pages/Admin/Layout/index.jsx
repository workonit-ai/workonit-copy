import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
	return (
		<div className="admin-wrapper">
			{/* <Header /> */}
			<div className="admin-aside">
				<Sidebar />
				<div style={{ flex: 1 }} className="layout-mains">
					<Outlet />
				</div>
			</div>

			{/* <Footer /> */}
			<ToastContainer autoClose={1000} closeOnClick={false} />
		</div>
	);
}
