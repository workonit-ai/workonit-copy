export const DateFormatter = (value, type) => {
	if (!value) return "";
	if (type == "date") {
		return new Date(value).toLocaleDateString();
	}
	if (type == "dateTime") {
		return new Date(value).toLocaleString();
	}
	if (type == "time") {
		return new Date(value).toLocaleTimeString();
	}
	if (type == "month") {
		return new Date(value).toLocaleString("default", { month: "long" });
	}
	if (type == "year") {
		return new Date(value).getFullYear();
	}
	if (type == "day") {
		return new Date(value).toLocaleString("default", { weekday: "long" });
	}
	if (type == "dayShort") {
		return new Date(value).toLocaleString("default", { weekday: "short" });
	}
	if (type == "monthShort") {
		return new Date(value).toLocaleString("default", { month: "short" });
	}
	if (type == "monthDay") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
		});
	}
	if (type == "monthDayYear") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
	if (type == "monthDayYearTime") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "monthDayYearTimeSec") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "monthDayYearTimeSecAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayYearTimeAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayYearAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayTimeAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayTimeSecAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "monthDayTimeSec") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "monthDayTime") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "monthYear") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
		});
	}
	if (type == "monthYearTime") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "monthYearTimeSec") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "monthYearTimeSecAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "monthYearTimeAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}
	if (type == "monthYearAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			year: "numeric",
			hour12: true,
		});
	}
	if (type == "monthAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			hour12: true,
		});
	}
	if (type == "monthTimeAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}
	if (type == "monthTimeSecAMPM") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "monthTimeSec") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "monthTime") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "year") {
		return new Date(value).toLocaleString("default", {
			year: "numeric",
		});
	}
	if (type == "yearTime") {
		return new Date(value).toLocaleString("default", {
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "yearTimeSec") {
		return new Date(value).toLocaleString("default", {
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "yearTimeSecAMPM") {
		return new Date(value).toLocaleString("default", {
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "yearTimeAMPM") {
		return new Date(value).toLocaleString("default", {
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}
	if (type == "short") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
	if (type == "medium") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "long") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "full") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "shortDate") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
	if (type == "mediumDate") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
	if (type == "longDate") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
	if (type == "fullDate") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			weekday: "long",
		});
	}
	if (type == "shortTime") {
		return new Date(value).toLocaleString("default", {
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "mediumTime") {
		return new Date(value).toLocaleString("default", {
			hour: "numeric",
			minute: "numeric",
		});
	}
	if (type == "longTime") {
		return new Date(value).toLocaleString("default", {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
	}
	if (type == "fullTime") {
		return new Date(value).toLocaleString("default", {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		});
	}
	if (type == "shortDateTime") {
		return new Date(value).toLocaleString("default", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	}

	if (type == "mmdd") {
		return new Date(value).toLocaleString("default", {
			month: "numeric",
			day: "numeric",
		});
	}
};

export const getQueryFormattedDate = (date) => new Date(date).toISOString().split("T")[0];
