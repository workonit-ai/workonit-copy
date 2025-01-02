export const generateNext7Days = (startIndex = 0) => {
	const today = new Date();
	today.setDate(today.getDate() + startIndex);
	const dates = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);
		const day = date.toLocaleString("en-US", { weekday: "short" }).toLowerCase(); // i have used this only for user display
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // i have used this only for user display
		const dayOfMonth = date.getDate().toString().padStart(2, "0"); // i have used this only for user display
		const year = date.getFullYear();
		const formattedDate = `${year}-${month}-${dayOfMonth}`; // i have used this for send wholeDate to backend
		const monthForShow = date.toLocaleString("en-US", { month: "short" });
		dates.push({ day, month, dayOfMonth, monthForShow, formattedDate });
	}
	return dates;
};

export const generateNext3Days = (startIndex = 0) => {
	const today = new Date();
	today.setDate(today.getDate() + startIndex);
	const dates = [];
	for (let i = 0; i < 3; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);
		const day = date.toLocaleString("en-US", { weekday: "short" }).toLowerCase(); // i have used this only for user display
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // i have used this only for user display
		const dayOfMonth = date.getDate().toString().padStart(2, "0"); // i have used this only for user display
		const year = date.getFullYear();
		const formattedDate = `${year}-${month}-${dayOfMonth}`; // i have used this for send wholeDate to backend
		const monthForShow = date.toLocaleString("en-US", { month: "short" });
		dates.push({ day, month, dayOfMonth, monthForShow, formattedDate });
	}
	return dates;
};
