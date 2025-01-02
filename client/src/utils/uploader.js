export const readFile = (file) => {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export const base64ToBinary = (str) => {
	// remove the data URI scheme and get only the base64-encoded image data
	let base64ImageData = str.split(",")[1];

	// decode the base64-encoded image data using the atob() function
	let decodedImageData = atob(base64ImageData);

	// create a Uint8Array from the decoded image data
	let binaryData = new Uint8Array(decodedImageData.length);
	for (let i = 0; i < decodedImageData.length; i++) {
		binaryData[i] = decodedImageData.charCodeAt(i);
	}

	return binaryData;
};

export const getSizeInMBs = (size) => size / (1024 * 1024);

export const setSizeInMBs = (size) => size / (1024 * 1024);
