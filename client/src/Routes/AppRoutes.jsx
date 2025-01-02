import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Layout from '../components/Layout/Layout';
import ChatScreen from '../pages/Authenticated/ChatScreeen';
import AdminLogin from '../pages/Admin/Auth';
import AdminLayout from '../pages/Admin/Layout';
import Assistants from '../pages/Admin/Dashboard/Assistants';
import AddAssistant from '../pages/Admin/Dashboard/Assistants/Add';
import Admins from '../pages/Admin/Dashboard/Admins';
import AddAdmin from '../pages/Admin/Dashboard/Admins/Add';
import Dashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Dashboard/Users';
import Privacy from '../pages/privacy.jsx';
import { useAuth } from '../context/AuthProvider';
import Terms from '../pages/terms.jsx';
import CreateShifts from '../pages/Shifts';
import EditAssistant from '../pages/Admin/Dashboard/Assistants/Edit/index.jsx';

const AppRoutes = () => {
	const { isLoggedIn, user } = useAuth();
	console.log("USER: ", user);
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					
					{/* <Route path="/chat/:agentName" element={<ChatScreen />} /> */}
					<Route path="/forgot-password" element={!isLoggedIn ? <ForgotPassword /> : <Navigate to="/" />} />

					<Route path="/admin" element={<AdminLogin />} />
					<Route
						path="/dashboard"
						element={!isLoggedIn ? <AdminLogin /> : user.role === "admin" ? <AdminLayout /> : <Navigate to="/" />}>
						<Route index element={<Dashboard />} />

						<Route path="admins" element={<Outlet />}>
							<Route index element={<Admins />} />

							<Route path="add" element={<Outlet />}>
								<Route index element={<AddAdmin />} />
							</Route>
						</Route>

						<Route path="users" element={<Outlet />}>
							<Route index element={<Users />} />

							{/* <Route path="add" element={<Outlet />}>
								<Route index element={<AddAdmin />} />
							</Route> */}
						</Route>

						<Route path="assistants" element={<Outlet />}>
							<Route index element={<Assistants />} />

							<Route path="add" element={<Outlet />}>
								<Route index element={<AddAssistant />} />
							</Route>

							<Route path="edit/:id" element={<Outlet />}>
								<Route index element={<EditAssistant />} />
							</Route>
						</Route>
					</Route>

					<Route path="/privacy" element={<Privacy/>} />
					<Route path="/terms" element={<Terms/>} />

					{/* Company specific route after sign-in */}
					<Route path="/shifts/:companyId" element={<CreateShifts />} />
                    {/* Employee specific route after sign-in */}
                    <Route path="/:companyId/:companyName" element={<ChatScreen />} />


					{/* <Route path="/:agentName/:businessId/:businessName" element={<SetShifts />} />			* Component for the employee to set the shifts */}
					<Route path="/:agentName" element={<ChatScreen />} />									{/** Generic Chat for all assistants */}
                    <Route path="/" element={<ChatScreen />} />
					<Route path="/*" element={<Navigate to="/" />} />

				</Routes>
			</Layout>
		</BrowserRouter>
	);
};

export default AppRoutes;
