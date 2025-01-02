import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { failureToaster, isDataExists } from '@utils';
import { getRequest } from '../../../api';
import Stats from './Stats';
import { NoData } from '@components';
import { Loader } from '../../../components';

const Dashboard = () => {
	// return (
	// 	<div>
	// 		<h1>Dashboard</h1>
	// 	</div>
	// );
	const navigate = useNavigate();

	const [isRendering, setIsRendering] = useState(false);
	const [users, setUsers] = useState([]);

	const getUsersData = async () => {
		setIsRendering(true);

		try {
			const result = await getRequest("/user/all");
			setUsers(result.data.users);
			setIsRendering(false);
		} catch (error) {
			failureToaster(error.message);
			setIsRendering(false);
		}
	};

	useEffect(() => {
		getUsersData();
	}, []);
	return (
		<div className="main">
			{isRendering && <Loader />}
			{!isRendering && (
				<div className="">
					<div className="card-box mb-4">
						<h3 className="fs-24 fw-700 mb-0">Dashboard</h3>
					</div>
					<Stats users={users} />
					<div className="row">
						<div className="col-md-6">
							<div className="card-box">
								<div className="mb-md-4">
									<h3 className="fs-24 fw-700 mb-0">New Users</h3>
								</div>

								<div className="table-responsive mh-300">
									<table className="table ">
										<thead>
											<tr>
												<th scope="col">Name</th>
												<th scope="col">Email</th>
												<th scope="col">Status</th>
											</tr>
										</thead>
										<tbody>
											{isDataExists(users) &&
												users.slice(Math.max(users.length - 7, 0)).map((item) => (
													<tr key={item._id}>
														<td>{item?.name}</td>
														<td>{item?.email}</td>
														<td>
															<span className="success-text text-capitalize">{item?.status}</span>
														</td>
													</tr>
												))}
											{!isDataExists(users) && (
												<tr>
													<td colSpan="3">
														<NoData message="No Users Yet!" />
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card-box">
								<div className="mb-md-4">
									<h3 className="fs-24 fw-700 mb-0">New Jobs</h3>
								</div>

								<div className="table-responsive mh-300">
									<table className="table">
										<thead>
											<tr>
												<th scope="col">Name</th>
												<th scope="col">Email</th>
												<th scope="col">Status</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
											<tr>
												<td>John Doe</td>
												<td>@johndoe</td>
												<td>
													<span className="default-text">New</span>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
