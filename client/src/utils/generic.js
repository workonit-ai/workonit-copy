export function isPropertyExistsInObject(object, property) {
	return object.hasOwnProperty(property);
}

export function isDataExists(data) {
	// Check if data is an array
	if (Array.isArray(data)) {
		return data.length > 0;
	}
	// Check if data is an object
	if (typeof data === "object") {
		return Object.keys(data).length > 0;
	}
	// Check if data is a string
	if (typeof data === "string") {
		return data.length > 0;
	}
	// Check if data is a number
	if (typeof data === "number") {
		return data > 0;
	}
	// Check if data is a boolean
	if (typeof data === "boolean") {
		return data;
	}

	return false;
}

export function compareObjects(obj1, obj2) {
	return Object.keys(obj1).some((key) => obj1[key] !== obj2[key]);
}

export function checkArraysEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;

	// using for in loop
	for (let i in arr1) {
		if (arr1[i] !== arr2[i]) return false;
	}

	return true;
}

export function checkArraysEqualKeyValue(arr1, arr2, key) {
	if (arr1.length !== arr2.length) return false;

	// using for in loop
	for (let i in arr1) {
		if (arr1[i].key !== arr2[i].key) return false;
	}

	return true;
}
