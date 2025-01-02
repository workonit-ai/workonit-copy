import { Fragment, useEffect, useState } from 'react';
import { isDataExists, validateInput } from '@utils';
import { numericOnly, phoneNumber } from '@directives';

const CustomInput = ({
	type = "text",
	placeholder = "Enter Here...",
	setState,
	name,
	state,
	isRequired = false,
	isPasteDisabled = false,
	pattern = null,
	minLength = null,
	maxLength = null,
	min = null,
	max = null,
	step = null,
	serverError = "",
	setServerError,
	setValidationsState = null,
	validationState = null,
	onPressEnter = null,
	autoFocus = false,
	isReadOnly = false,
	isPhoneNumber = false,
	isNumericOnly = false,
	extraClasses = "",
	isFormSubmitted = false,
	externalStyles = {},
	icon = undefined,
	iconifyIcon = undefined,
	isDisabled = false,
}) => {
	const [validationErrors, setValidationErrors] = useState([]);
	const [emailValidationErrorExists, setEmailValidationErrorExists] = useState(false);

	const inputValidation = (e) => {
		if (!!!setValidationsState) return;

		const errors = validateInput(e);
		setValidationErrors(errors);

		if (isDataExists(errors)) setValidationsState((prev) => ({ ...prev, [name]: true }));
		else {
			setValidationsState((prev) => ({ ...prev, [name]: false }));
			if (!!setServerError) setServerError("");
		}
	};

	const onValidateEmail = (e) => {
		if (!!!setValidationsState) return;
		setEmailValidationErrorExists(!!e.target.value && !e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
	};

	const setStateValue = (e) => {
		let value = e.target.value;
		if (type === "number") {
			if (min && value < min) value = min;
			if (max && value > max) value = max;
		}

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
			{icon && <i className={`icon ${icon}`}></i>}
			<input
				style={externalStyles}
				className={` ${extraClasses} ${isDataExists(validationErrors) || isDataExists(serverError) ? "error-input" : ""}`}
				type={type}
				placeholder={placeholder}
				value={state[name]}
				readOnly={isReadOnly}
				autoFocus={autoFocus}
				{...(isRequired && { required: true })}
				{...(pattern && { pattern })}
				{...(minLength && { minLength })}
				{...(maxLength && { maxLength })}
				{...(min && { min })}
				{...(max && { max })}
				{...(step && { step })}
				onChange={(e) => {
					setStateValue(e);
					inputValidation(e);
				}}
				onPaste={(e) => {
					if (!!isPasteDisabled) e.preventDefault();
				}}
				onKeyPress={(e) => {
					if (isPhoneNumber) phoneNumber(e);
					if (isNumericOnly) numericOnly(e);
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter" && !!onPressEnter) onPressEnter(e);
				}}
				onBlur={(e) => {
					if (type === "email") onValidateEmail(e);
				}}
				disabled={isDisabled}
			/>
			{iconifyIcon && <span className="iconify" data-icon={iconifyIcon}></span>}

			{!isFormSubmitted && emailValidationErrorExists && <div className="error">Please enter a valid email address.</div>}

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

export default CustomInput;
