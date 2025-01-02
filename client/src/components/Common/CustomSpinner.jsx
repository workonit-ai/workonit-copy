const CustomSpinner = ({ color = "white", isBig = false, extraClasses = "" }) => {
	return (
		<div className={`spinner-border text-${color} ${extraClasses} ${isBig ? "big-spinner" : ""}`} role="status">
			<span className="sr-only">Loading...</span>
		</div>
	);
};

export default CustomSpinner;
