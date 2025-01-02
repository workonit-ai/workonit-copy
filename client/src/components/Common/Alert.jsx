import { useEffect } from 'react';

import { NO_IMAGE } from '@constants';

const TopAlert = ({ message = "", isError = false, resetState, isCloseAble = true }) => {
	const resetStates = () => {
		if (resetState) resetState("");
	};

	useEffect(() => {
		setTimeout(() => {
			resetStates();
		}, 3000);
	}, []);

	return (
		<div className="top-alert">
			<div className={`errorAlert ${isError ? "alert-error" : "success"}`}>
				<div className="d-flex align-items-center gap-3">
					<div className="alertImg">
						{isError && <img src="/assets/images/error-alert.png" alt={NO_IMAGE} />}
						{!isError && <img src="/assets/images/tick-circle.png" alt={NO_IMAGE} />}
					</div>
					<div className="errorDescription">{message}</div>
				</div>
			</div>
			{isCloseAble && (
				<div onClick={() => resetStates()} className="closeIcon">
					<img src="/assets/images/close-circle.png" alt="" />
				</div>
			)}
		</div>
	);
};

export default TopAlert;
