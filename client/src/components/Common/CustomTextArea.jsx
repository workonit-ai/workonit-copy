import { Fragment, useEffect, useState } from 'react';
import { isDataExists, validateInput } from '@utils';
import { isDate } from 'moment/moment';

const CustomTextArea = ({
	placeholder = "Enter Here...",
	name,
	setState,
	state,
	isRequired = false,
	isPasteDisabled = false,
	minLength = null,
	maxLength = null,
	serverError = "",
	setValidationsState = null,
	validationState = null,
	onPressEnter = null,
	autoFocus = false,
	isReadOnly = false,
	extraClasses = "",
	isFormSubmitted = false,
	cols = "6",
	rows = "3",
}) => {
	const [validationErrors, setValidationErrors] = useState([]);

	const controlValidation = (e) => {
		const errors = validateInput(e);
		setValidationErrors(errors);

		if (isDate(errors)) setValidationsState((prev) => ({ ...prev, [name]: true }));
		else setValidationsState((prev) => ({ ...prev, [name]: false }));
	};

	const setStateValue = (e) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		if (isFormSubmitted && isRequired && !!!state[name]) {
			setValidationErrors(["This field is required"]);
			setValidationsState((prev) => ({ ...prev, [name]: true }));
		}
	}, [isFormSubmitted]);

	return (
		<Fragment>
			<textarea
				readOnly={isReadOnly}
				autoFocus={autoFocus}
				placeholder={placeholder}
				className={` ${extraClasses} ${isDataExists(validationErrors) || isDataExists(serverError) ? "error-input" : ""}`}
				onChange={(e) => {
					setStateValue(e);
					controlValidation(e);
				}}
				onPaste={(e) => {
					if (!!isPasteDisabled) e.preventDefault();
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter" && !!onPressEnter) onPressEnter(e);
				}}
				value={state[name]}
				{...(isRequired && { required: true })}
				{...(minLength && { minLength: minLength })}
				{...(maxLength && { maxLength: maxLength })}
				cols={cols}
				rows={rows}
			></textarea>

			{isFormSubmitted &&
				isDataExists(validationErrors) &&
				validationErrors.map((error, i) => (
					<div key={i} className="error">
						{error}
					</div>
				))}
		</Fragment>
	);
};

export default CustomTextArea;
