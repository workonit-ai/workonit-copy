import Avatar from 'react-avatar';
import './MainScreen.css';
import React from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthProvider';
import SideBarSkeleton from '../../components/Skeleton/SideBarSkeleton';
import { useState } from 'react';
const SideBar = ({ handleAgentClick, agents, isLoading, setShowModal, selectedAgent }) => {
	const { logout, isLoggedIn } = useAuth();
	
	return (
		
		<div className={selectedAgent == null ? "chat_sidebar" : "chat_sidebar hidden"}>
			<div className="sidebar__slogan">
				<h4>AI Assistants</h4>
			</div>

			<div className="sidebar__chats">
				{!isLoading ? (
					<div className="agents">
						{agents
							?.sort((a, b) => {
								if (!a.lastModified) return 1; // a is sorted to the end
								if (!b.lastModified) return -1; // b is sorted to the end
								return new Date(b.lastModified) - new Date(a.lastModified); // normal comparison
							})
							.map((agent, index) => (
								<div
									className={selectedAgent?.assistant_id === agent._id ? "selected sidebarChat" : "sidebarChat"}
									key={agent._id}
									onClick={() => handleAgentClick(agent)}>
									<Avatar name={agent.name} size="36" round />
									<div className="sidebarChat__info">
										<div style={{ marginLeft: "5px", fontWeight: "bold" }}>{agent.name}</div>
									</div>
								</div>
							))}
					</div>
				) : (
					<SideBarSkeleton count={4} />
				)}

				<div className="action__buttons">
					{isLoggedIn ? (
						<button className="action__button logout__button" onClick={logout}>
							<LogoutOutlinedIcon style={{ color: "red" }} />
							<span className="logout__text">Logout</span>
						</button>
					) : (
						<button className="action__button login__button" onClick={() => setShowModal(true)}>
							<AccountCircleIcon style={{ color: "#1078a8" }} />
							<span className="login__text">Login</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
