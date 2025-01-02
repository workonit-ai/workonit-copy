import { useEffect, useState } from 'react';
import { confirmationAlert, failureToaster, isDataExists, successToaster } from '@utils';
import { Loader, NoData } from '@components';
import { deleteRequest, getRequest, postRequest } from '../../../../api';

const DELETION_SUCCESS_MESSAGE = "User deleted successfully!";

const AllUsers = () => {
	const [selectedUser, setSelectedUser] = useState(null);

	const [users, setUsers] = useState([]);
	const [isRendering, setIsRendering] = useState(false);

	const onDeleteUser = async (id, index) => {
		try {
			await deleteRequest(`/user/delete/${id}`);
			successToaster(DELETION_SUCCESS_MESSAGE);
			const newUsers = [...users];
			newUsers.splice(index, 1);
			setUsers(newUsers);
		} catch (error) {
			failureToaster(error.message);
		}
	};

	const onChangeUserStatus = async (status, i, id) => {
		try {
			await postRequest("/user/change-status", { id, status });
			const result = [...users];
			result[i].status = status;
			setUsers(result);
			successToaster("Status changed successfully");
		} catch (error) {
			failureToaster(error.message);
		}
	};

	const getUsersData = async () => {
		setIsRendering(true);

		try {
			const result = await getRequest("/user/all");
			console.log(result);
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
			<div className="card-box mb-md-4">
				<h3 className="fs-24 fw-700 mb-0">All Users</h3>
			</div>

			{!isRendering && (
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Name</th>
								<th scope="col">Email</th>
								<th scope="col">Status</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{isDataExists(users) &&
								users.map((item, i) => (
									<tr key={item._id}>
										<td>{item?.name}</td>
										<td>{item?.email}</td>
										<td>
											<span className={`text-capitalize ${item.status === "active" ? "success-text" : "error-text"}`}>
												{item?.status}
											</span>
										</td>
										<td>
											<div className="d-flex gap-3">
												<a className="fs-22 default-text pointer" onClick={() => setSelectedUser(item)}>
													<span className="iconify" data-icon="carbon:view"></span>
												</a>
												{item.status === "active" && (
													<a
														className="fs-22 text-danger pointer"
														onClick={() => onChangeUserStatus("inactive", i, item._id)}>
														<span className="iconify" data-icon="tdesign:user-blocked"></span>
													</a>
												)}
												{item.status === "inactive" && (
													<a
														className="fs-22 text-success pointer"
														onClick={() => onChangeUserStatus("active", i, item._id)}>
														<span className="iconify" data-icon="mdi:user-tick-outline"></span>
													</a>
												)}
												<a
													className="fs-22 text-danger pointer"
													onClick={() => confirmationAlert(() => onDeleteUser(item._id, i))}>
													<span className="iconify" data-icon="heroicons:trash"></span>
												</a>
											</div>
										</td>
									</tr>
								))}
							{!isDataExists(users) && (
								<tr>
									<td colSpan="5">
										<NoData message="No Users Yet!" />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
			{isRendering && <Loader />}
		</div>
	);
};

export default AllUsers;
