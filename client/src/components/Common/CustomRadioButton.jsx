import { isDataExists } from '@utils';

const CustomRadioButton = ({ setState, name, state, extraClasses = "", externalStyles = {}, options = [] }) => {
	const onValueChange = (e) => {
		setState((prev) => ({ ...prev, [name]: e.target.value }));
	};

	return (
		<div className={`d-flex gap-3 align-items-center flex-wrap ${extraClasses}`} style={externalStyles}>
			{isDataExists(options) &&
				options.map((option) => (
					<div className="d-flex  gap-2" key={option.value}>
						<input
							className="form-check-radio pointer"
							type="radio"
							name={name}
							id={`${name}-${option.value}-label`}
							value={option.value}
							checked={state[name] === option.value}
							onChange={onValueChange}
						/>
						<label
							className="pointer fs-md-14 mb-0 mt-first fw-500 muted-text"
							htmlFor={`${name}-${option.value}-label`}>
							{option.label}
						</label>
					</div>
				))}
		</div>
	);
};

export default CustomRadioButton;
