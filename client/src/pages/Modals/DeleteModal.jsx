import React from 'react';

const DeleteModal = ({ title, children, onConfirm, onCancel }) => {
	return (
		<div className="modal">
			<div className="modal-content">
				<h2>{title}</h2>
				<p>{children}</p>
				<button onClick={onConfirm}>Yes</button>
				<button onClick={onCancel}>No</button>
			</div>
		</div>
	);
};

export default DeleteModal;
