import DatePicker from 'react-datepicker';
import { DOB_MAX_DATE, months, years } from '@constants';
import { getMonth, getYear } from 'date-fns';

const CustomDatePicker = ({ value = new Date(), setValue, maxDate = new Date(DOB_MAX_DATE), minDate = new Date(), isSelectStart = false, isSelectEnd = false, startDate, endDate }) => {
	return (
		<div className="date_picker_custom ">
			<DatePicker
				renderCustomHeader={({ date, changeYear, changeMonth }) => (
					<div className="header-btns ">
						<div className="month item pointer ">
							<select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
								{months.map((option) => (
									<option key={option} value={option} className="custom_option">
										{option}
									</option>
								))}
							</select>
						</div>
						<div className="year item justify-content-end pointer">
							<select
								value={getYear(date)}
								onChange={({ target: { value } }) => {
									changeYear(value);
								}}
							>
								{years.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
				)}
				selected={value}
				onChange={(date) => setValue(date)}
				// minDate={minDate}
				maxDate={maxDate}
				formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
				{...(isSelectStart && "selectsStart")}
				{...(isSelectEnd && "selectsEnd")}
				{...(startDate && { startDate })}
				{...(endDate && { endDate })}
			/>
		</div>
	);
};

export default CustomDatePicker;
