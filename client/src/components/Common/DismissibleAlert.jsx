import React, { Fragment } from 'react';
import { CustomSpinner } from '@components';

const DismissibleAlert = ({ isCloseAble = true, message = "", btnMessage = "", onBtnClick = null, isLoading = false, isTopBanner = false, onCloseClick = null }) => {
	if (!!isCloseAble && !!onCloseClick) {
		setTimeout(() => {
			onCloseClick();
		}, 1500);
	}

	return (
		<div className={`alert alert-danger alert-dismissible fade show w-100 d-flex justify-content-between mb-0 ${isTopBanner ? "position-absolute" : ""}`} role="alert">
			<div className="alert-msg">
				{message}{" "}
				{!!onBtnClick && (
					<Fragment>
						{isLoading && <CustomSpinner color="danger" />}

						{!isLoading && (
							<a className="pointer text-underlined" onClick={onBtnClick}>
								{btnMessage}
							</a>
						)}
					</Fragment>
				)}{" "}
			</div>
			{isCloseAble && (
				<div onClick={onCloseClick} className="dismissible-close-btn">
					<img src="/assets/images/close-circle.png" alt="" />
				</div>
			)}
		</div>
	);
};

export default DismissibleAlert;
