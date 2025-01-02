import { useEffect, useState } from 'react';

const Stats = ({ users, totalRevenue = 232 }) => {
	const [activeUsers, setActiveUsers] = useState(0);
	const [blockedUsers, setBlockedUsers] = useState(0);

	useEffect(() => {
		const activeUsers = users.filter((item) => item.status === "active");
		const blockedUsers = users.filter((item) => item.status === "inactive");

		setActiveUsers(activeUsers.length);
		setBlockedUsers(blockedUsers.length);
	}, [users]);

	return (
		<div className="row">
			<div className="col-md-3 mb-4">
				<div className="card-box d-flex flex-column gap-4 justify-content-between fw-600 py-lg-4">
					<span className="fs-md-24">All Users</span>
					<span className="fs-md-24 default-text">{users.length}</span>
				</div>
			</div>

			<div className="col-md-3 mb-4">
				<div className="card-box d-flex flex-column gap-4 justify-content-between fw-600 py-lg-4">
					<span className="fs-md-24">Active Users</span>
					<span className="fs-md-24 default-text">{activeUsers}</span>
				</div>
			</div>

			<div className="col-md-3 mb-4">
				<div className="card-box d-flex flex-column gap-4 justify-content-between fw-600 py-lg-4">
					<span className="fs-md-24">Blocked Users</span>
					<span className="fs-md-24 default-text">{blockedUsers}</span>
				</div>
			</div>

			<div className="col-md-3 mb-4">
				<div className="card-box d-flex flex-column gap-4 justify-content-between fw-600 py-lg-4">
					<span className="fs-md-24">Total Revenue</span>
					<span className="fs-md-24 default-text">${totalRevenue}</span>
				</div>
			</div>
		</div>
	);
};

export default Stats;
