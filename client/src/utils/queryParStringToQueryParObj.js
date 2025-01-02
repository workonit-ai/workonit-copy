export const convertQueryParamsStringToQueryParamsObject = (url) => {
	let queryParams = {};
	url = url.substring(1);
	const queryParamsArray = url.split("&");

	queryParamsArray.forEach((queryParam) => {
		const queryParamArray = queryParam.split("=");
		queryParams[queryParamArray[0]] = queryParamArray[1];
	});
	return queryParams;
};

export const removeQueryParam = (url, paramToRemove) => {
	let queryParams = convertQueryParamsStringToQueryParamsObject(url);
	delete queryParams[paramToRemove];
	let newUrl = "?";
	Object.keys(queryParams).forEach((key) => {
		newUrl += `${key}=${queryParams[key]}&`;
	});
	newUrl = newUrl.substring(0, newUrl.length - 1);
	return newUrl;
};
