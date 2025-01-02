import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
	return (
		<div className="screen">
			{children}
			<ToastContainer autoClose={1000} closeOnClick={false} />
		</div>
	);
};

export default Layout;
