import { Fragment, useEffect, useState } from 'react';
import { DateFormatter, QueryFormattedDate } from '@transformers';
import { WeekDays } from '@constants';

const defaultWeekFormat = WeekDays.map((item) => ({
	...item,
	date: null,
}));

const WeekDaySelector = ({ setOutput }) => {
	const [currentWeek, setCurrentWeek] = useState(defaultWeekFormat);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const onChangeDate = (date) => setSelectedDate(date);

	const previousWeek = () => {
		const previousWeek = currentWeek.map((item) => {
			const date = new Date(item.date);
			date.setDate(date.getDate() - 7);
			return {
				...item,
				date,
			};
		});

		setCurrentWeek(previousWeek);
	};

	const nextWeek = () => {
		const nextWeek = currentWeek.map((item) => {
			const date = new Date(item.date);
			date.setDate(date.getDate() + 7);
			return {
				...item,
				date,
			};
		});

		setCurrentWeek(nextWeek);
	};

	useEffect(() => {
		setOutput(selectedDate);
	}, [selectedDate]);

	useEffect(() => {
		const currentDay = selectedDate.getDay();

		const week = currentWeek.map((item, index) => {
			const date = new Date(selectedDate);

			date.setDate(selectedDate.getDate() + index - currentDay);
			return {
				...item,
				date,
			};
		});

		setCurrentWeek(week);
	}, []);

	return (
		<Fragment>
			<div className="d-flex justify-content-center">
				<div className="d-flex align-items-center gap-3">
					<div className="left-circle pointer" onClick={previousWeek}>
						<img src="/assets/images/left-circle.svg" alt="circle" />
					</div>
					<div className="gray-text fs-24 fw-700">{DateFormatter(selectedDate, "short")}</div>
					<div className="left-circle pointer" onClick={nextWeek}>
						<img src="/assets/images/right-circle.svg" alt="circle" />
					</div>
				</div>
			</div>
			<div className="container mt-5">
				<div className="d-flex flex-column flex-lg-row ">
					{currentWeek.map((item) => (
						<>
							{!!item.date && (
								<div
									className={`date-boxes flex-1 flex-wrap pointer ${QueryFormattedDate(selectedDate) === QueryFormattedDate(item.date) ? "active" : ""}  ${
										QueryFormattedDate(item.date) < QueryFormattedDate(new Date()) ? "disabled" : ""
									}`}
									key={item.date}
									onClick={() => onChangeDate(item.date)}
								>
									<div className="fs-20 gray-text fw-600">{item.label}</div>
									<div className="fs-14 fw-600 date">{DateFormatter(item.date, "mmdd")}</div>
								</div>
							)}
						</>
					))}
				</div>
			</div>
		</Fragment>
	);
};

export default WeekDaySelector;
