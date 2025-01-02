import React, { useEffect, useState } from 'react';
import { deleteRequest, getRequest } from '../../../../api';
import { useNavigate } from 'react-router-dom';
import { failureToaster, successToaster } from '../../../../utils/swal.js';
import { Loader, NoData } from '@components';

const Assistants = () => {
	const navigate = useNavigate();
	const [assistants, setAssistants] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [id, setId] = useState(null);
	const [name, setName] = useState(null);
	const [isRendering, setIsRendering] = useState(false);

	useEffect(() => {
		fetchAssistants();
	}, []);

	const fetchAssistants = async () => {
		setIsRendering(true);
		try {
			const response = await getRequest(`/admin/assistants`);
			console.log(response);

			setAssistants(response.data.assistants);
		} catch (error) {
			failureToaster("Error fetching Assistants");
		}

		setIsRendering(false);
	};

	const handleDelete = async () => {
		try {
			const response = await deleteRequest(`assistant/delete/${id}`);
			successToaster("Assistant removed successfully");
			fetchAssistants();
		} catch (error) {
			failureToaster("Error removing Assistant");
		}
	};

	const handleEdit = (assistantId) => {
		navigate(`/dashboard/assistants/edit/${assistantId}`);
	};

	return (
		<div className="main">
			<div className="card-box mb-4">
				<div className="employee-heading">
					<h3 className="fs-24 fw-700 mb-0">Manage Assistants</h3>
					<button className="primary-btn w-md-auto" onClick={() => navigate("/dashboard/assistants/add")}>
						Add New Assistant <img src="/assets/images/plus-ic.svg" alt="" />
					</button>
				</div>
			</div>
			{isRendering && console.log("rendering")}
			{isRendering && <Loader />}
			{!isRendering && assistants.length === 0 && <NoData />}
			{!isRendering && (
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Name</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{assistants.map((assistant) => (
								<tr key={assistant._id}>
									<td className="table-cell">{assistant.name}</td>
									<td className="d-flex gap-3">
										<a
											className="fs-22 text-primary pointer"
											onClick={() => handleEdit(assistant._id)}>
											<span className="iconify" data-icon="bx:pencil"></span>
										</a>
										<a
											className="fs-22 text-danger pointer"
											data-bs-toggle="modal"
											data-bs-target="#deleteModal"
											onClick={() => {
												setId(assistant._id);
												setName(assistant.name);
											}}>
											<span className="iconify" data-icon="heroicons:trash"></span>
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="fs-md-24" id="exampleModalLabel">
								Are you sure you want to delete {name}?
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
							<button type="button" className="danger-btn" data-bs-dismiss="modal" onClick={() => handleDelete()}>
								Yes
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Assistants;