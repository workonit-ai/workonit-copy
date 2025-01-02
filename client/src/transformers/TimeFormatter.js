export const TimeFormatter = (value) => {
	if (!value) return "";

	let timeFormat = {
		hour: "2-digit",
		minute: "2-digit",
		isAfter12: true,
	};

	if (value.split(":")[0] < 12) timeFormat.isAfter12 = false;
	else timeFormat.isAfter12 = true;

	let time = value.split(":");

	timeFormat.hour = (Number(time[0]) % 12).toString().padStart(2, "0");
	timeFormat.minute = time[1].toString().padStart(2, "0");

	return `${timeFormat.hour}:${timeFormat.minute} ${timeFormat.isAfter12 ? "PM" : "AM"}`;
};

export const timesAgoFromTime = (value) => {
	if (!value) return "";

	const [hours, minutes] = value.split(":");
	const date = new Date();
	date.setHours(hours, minutes);

	const diffMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);

	if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
	if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
	return `${Math.floor(diffMinutes / 1440)} days ago`;
};

export const timesAgoFromDate = (value) => {
	if (!value) return "";

	const date = new Date(value);

	const diffMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);

	// check if updated just now
	if (diffMinutes < 1) return `Just now`;
	if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
	if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
	return `${Math.floor(diffMinutes / 1440)} days ago`;
};

export const QueryFormattedDate = (date) => {
	const newDate = new Date(date).toLocaleString().split(",")[0];
	const [month, day, year] = newDate.split("/");

	return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};
