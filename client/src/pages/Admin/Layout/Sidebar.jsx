import './layout.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';

const Sidebar = () => {
	const { logout } = useAuth();
	return (
		<div className="sidebar">
			<ul>
				{/* <li className="logo">
					<img src={Logo} height={100} alt="Company Logo" />
				</li> */}
				<li>
					<NavLink to={"/dashboard"} end>
						<span className="side-ic">
							<span className="iconify" data-icon="humbleicons:dashboard"></span>
						</span>
						<span className="side-link">Dashboard</span>
					</NavLink>
				</li>
				<li>
					<NavLink to={"/dashboard/admins"}>
						<span className="side-ic">
							<span className="iconify" data-icon="humbleicons:users"></span>
						</span>
						<span className="side-link">Manage Admins</span>
					</NavLink>
				</li>
				<li>
					<NavLink to={"/dashboard/users"}>
						<span className="side-ic">
							<span className="iconify" data-icon="humbleicons:users"></span>
						</span>
						<span className="side-link">Users</span>
					</NavLink>
				</li>
				<li>
					<NavLink to={"/dashboard/assistants"}>
						<span className="side-ic">
							<span className="iconify" data-icon="mdi:support"></span>
						</span>
						<span className="side-link">Assistants</span>
					</NavLink>
				</li>
				<li>
					<NavLink to={"/dashboard/jobs"}>
						<span className="side-ic">
							<span className="iconify" data-icon="humbleicons:archive"></span>
						</span>
						<span className="side-link">View Jobs</span>
					</NavLink>
				</li>
			</ul>
			<div className="bottom-content">
				<ul>
					<li className="mb-0 ">
						{/* <a
							className="pointer"
							// onClick={() => {
							// 	homeSidebarClose();
							// 	onLogout();
							// }}
						>
							<span className="side-ic">
								<span className="iconify" data-icon="material-symbols:logout"></span>{" "}
							</span>
							<span className="side-link">Logout</span>
						</a> */}
						<NavLink onClick={logout}>
							<span className="side-ic">
								<span className="iconify" data-icon="material-symbols:logout"></span>
							</span>
							<span className="side-link">Logout</span>
						</NavLink>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
