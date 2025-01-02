import { isDataExists } from './generic';

export const validateEmail = (email) => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

export const genericBodyValidator = (body, validationErrors = {}, ignorantFields = []) => {
	for (let field in body) {
		if (isDataExists(ignorantFields) && ignorantFields.includes(field)) continue;

		if (body[field].length <= 0) return true;
	}
	for (let field in validationErrors) if (validationErrors[field]) return true;
	return false;
};

export const validateNumber = (number) => {
	const re = /^[0-9]+$/;
	return re.test(number);
};
