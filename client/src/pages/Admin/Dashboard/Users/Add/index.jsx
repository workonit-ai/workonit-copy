import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { failureToaster, successToaster } from '../../../../../utils/swal.js';
import { postRequest } from '../../../../../api';

const AddAdmin = () => {
	const navigate = useNavigate();
	const [body, setBody] = useState({
		email: "",
		password: "",
		name: "",
	});

	const handleChange = (e) => {
		setBody({ ...body, [e.target.name]: e.target.value });
	};

	const callApi = async (e) => {
		e.preventDefault();
		const response = await postRequest("/admin/add-admin", body);
		if (response.status === 200) {
			successToaster("Admin Added Successfully");
			navigate("/dashboard/admins");
		} else {
			failureToaster("Failed to Add Admin");
		}
	}

	return (
		<div className="main">
			<div className="card-box mb-4">
				<div className="employee-heading">
					<h3>Add Admin</h3>
				</div>
			</div>

			<div className="form row" style={{ marginTop: "20px" }}>
				{/* <h3 style={{ textAlign: "center" }}>Advance</h3> */}
				<input
					type="text"
					name="name"
					value={body.name}
					onChange={handleChange}
					placeholder="Admin Name"
					className="form-input"
				/>
				<input
					type="email"
					name="email"
					value={body.email}
					onChange={handleChange}
					placeholder="Admin Email"
					className="form-input"
				/>

				<input
					type="text"
					name="password"
					value={body.password}
					onChange={handleChange}
					placeholder="Admin Password"
					className="form-input"
				/>

				<button className="danger-btn" onClick={e => callApi(e)}>
					Add
				</button>
			</div>
		</div>
	);
};

export default AddAdmin;
