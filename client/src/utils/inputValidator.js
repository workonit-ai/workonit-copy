export const validateInput = (event) => {
	let target = event.target;
	target.value = target.value.trim();
	let errors = [];

	if (target.required === true) {
		if (target.value.trim() === "" || target.value.trim() === null || !target.value.trim()) {
			errors.push("This field is required");
		}
	}

	if (target.type === "email") {
		if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
			errors.push("Please enter a valid email address");
		}
	}

	if (target.pattern?.length >= 0) {
		if (!target.value.match(target.pattern)) {
			errors.push(`Please enter a valid value ${target.name && "for " + target.name}`);
		}
	}

	if (target.minLength > -1) {
		if (target.value.length < target.minLength) {
			errors.push("This field must be at least " + target.minLength + " characters long");
		}
	}

	if (target.maxLength > -1) {
		if (target.value.length > target.maxLength) {
			errors.push("This field must be no more than " + target.maxLength + " characters long");
		}
	}

	if (+target.min?.length > 0) {
		if (+target.value < +target.min) {
			errors.push("This field must be at least " + +target.min);
		}
	}

	if (target.max?.length > 0) {
		if (+target.value > +target.max) {
			errors.push("This field must be no more than " + +target.max);
		}
	}

	if (target.step?.length > 0) {
		if (target.value % target.step !== 0) {
			errors.push("This field must be a multiple of " + +target.step);
		}
	}

	if (target.type === "url") {
		if (!target.value.match(/^(http|https):\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/)) {
			errors.push("Please enter a valid URL");
		}
	}

	return errors;
};
