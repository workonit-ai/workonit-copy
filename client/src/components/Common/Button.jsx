import React, { Fragment } from 'react';
import { CustomSpinner } from '@components';

const Button = (props) => {
	const { style, text, onClick, className, hasIcon, hasImgLeft, hasImgRight, isBusy = false, validator } = props;

	return (
		<button className={`${className}`} style={style} onClick={(e) => !isBusy && onClick(e)} disabled={validator && validator()}>
			{isBusy && <CustomSpinner />}
			{!isBusy && (
				<Fragment>
					{hasImgLeft && <img src={hasImgLeft} className="img-icon" />}
					{text && <span>{text}</span>}
					{hasIcon && <i className="icon"></i>}
					{hasImgRight && <img src={hasImgRight} className="img-icon" />}
				</Fragment>
			)}
		</button>
	);
};

export default Button;
