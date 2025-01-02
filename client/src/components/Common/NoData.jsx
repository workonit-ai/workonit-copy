import React from 'react';

const NoData = ({ message = "No Data Found!", isMinimal = true, extraClasses = "" }) => {
	return (
		<div className={` ${isMinimal ? "minimal-no-data" : "no-data"} `}>
			<h1 className={`${extraClasses}`}>{message}</h1>
		</div>
	);
};

export default NoData;
