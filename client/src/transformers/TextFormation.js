export const titleCase = (value) => {
	if (!value) return "";
	value = value.toString();
	return value.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export const capitalizeFirstLetter = (oldText) => oldText.charAt(0).toUpperCase() + oldText.slice(1);

export const kebabCaseToTitleCase = (oldText) => {
	if (!!oldText) return titleCase(oldText.replace(/-/g, " "));

	return oldText;
};
