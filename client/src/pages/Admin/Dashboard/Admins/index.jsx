import React, { useEffect, useState } from 'react';
import './emp.css';
import { deleteRequest, getRequest, postRequest } from '../../../../api';
import { useNavigate } from 'react-router-dom';
import { failureToaster, successToaster } from '../../../../utils/swal.js';
import { Loader } from '@components';

const Admins = () => {
	const navigate = useNavigate();
	const [admins, setAdmins] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [adminId, setAdminId] = useState(null);
	const [adminName, setAdminName] = useState(null);
	const [isRendering, setIsRendering] = useState(false);

	useEffect(() => {
		fetchAdmins();
	}, []);

	const fetchAdmins = async () => {
		setIsRendering(true);
		try {
			const response = await getRequest(`/admin`);
			// console.log(response);
			setAdmins(response.data.admins);
		} catch (error) {
			failureToaster("Error fetching Admins");
		} finally {
			setIsRendering(false);
		}
	};

	const deleteAdmin = async (email) => {
		try {
			const response = await postRequest(`/admin/delete-admin`, { email: email });
			console.log(response);
			successToaster("Admin deleted successfully");
		} catch (error) {
			failureToaster("Error deleting Admin");
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await deleteRequest(`/admin/${id}`);
			successToaster("Admin deleted successfully");
			fetchByType(type);
		} catch (error) {
			failureToaster("Error deleting employee");
		}
	};

	return (
		<div className="main">
			<div className="card-box mb-4">
				<div className="employee-heading">
					<h3 className="fs-24 fw-700 mb-0">Manage Admins</h3>
					<button class="primary-btn w-md-auto" onClick={() => navigate("/dashboard/admins/add")}>
						Add New Admin <img src="/assets/images/plus-ic.svg" alt="" />
					</button>
				</div>
			</div>
			{!isRendering && (
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Name</th>
								<th scope="col">Email</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{admins.map((admin) => (
								<tr key={admin._id}>
									<td className="table-cell">{admin.name}</td>
									<td className="table-cell">{admin.email}</td>
									<td className="d-flex gap-3">
										<a
											className="fs-22 text-danger pointer"
											data-bs-toggle="modal"
											data-bs-target="#deleteModal"
											onClick={() => {
												setAdminName(admin.email);
												setShowModal(true);
											}}>
											<span className="iconify" data-icon="heroicons:trash"></span>
										</a>

										<a className="action-icons" onClick={() => handleViewDetails(employee._id)}>
											<iconify-icon icon="bxs:user-detail" width="1.2rem" height="1.2rem"></iconify-icon>
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{isRendering && <Loader />}
			<div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="fs-md-24" id="exampleModalLabel">
								Are you sure you want to delete {adminName}?
							</h5>
							<button
								type="button"
								className="btn-close"
								style={{ position: "absolute", right: "9px", top: "9px" }}
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>

						<div className="modal-footer">
							<button type="button" className="primary-btn bg-transparent hover default-text" data-bs-dismiss="modal">
								No
							</button>
							<button
								type="button"
								className="danger-btn"
								data-bs-dismiss="modal"
								onClick={() => deleteAdmin(adminName)}>
								Yes
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admins;
