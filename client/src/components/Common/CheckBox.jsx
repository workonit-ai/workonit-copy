const CheckBox = ({ label, value, onChange }) => {
	return (
		<label>
			<input type="checkbox" checked={value} onChange={onChange} id={label} />
			{label}
		</label>
	);
};

export default CheckBox;
