import Swal from 'sweetalert2';

import { titleCase } from '@transformers';
import {
    BACKGROUND_COLOR,
    CANCEL_BUTTON_COLOR,
    CONFIRM_BUTTON_COLOR,
    CONFIRM_BUTTON_TEXT,
    ErrorMessages,
    MESSAGE_DISPLAY_TIME,
    TEXT_COLOR
} from '@constants';

export const errorDisplay = (error = ErrorMessages.generalMessage) => {
	Swal.fire({
		background: BACKGROUND_COLOR,
		color: TEXT_COLOR,
		icon: "error",
		title: "Oops...",
		confirmButtonColor: BACKGROUND_COLOR,
		text: titleCase(error),
	});
};

export const successDisplay = (msg = "Success!", position = null) => {
	let alertBody = {
		icon: "success",
		background: BACKGROUND_COLOR,
		color: TEXT_COLOR,
		title: "Success",
		text: titleCase(msg),
		showConfirmButton: false,
		timer: MESSAGE_DISPLAY_TIME,
	};

	if (position) alertBody.position = position;

	Swal.fire(alertBody);
};

export const successToaster = (msg = "Success!") => {
	const Toast = Swal.mixin({
		toast: true,
		background: BACKGROUND_COLOR,
		color: TEXT_COLOR,
		position: "top-end",
		showConfirmButton: false,
		timer: MESSAGE_DISPLAY_TIME,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	Toast.fire({
		icon: "success",
		text: titleCase(msg),
	});
};

export const failureToaster = (msg = ErrorMessages.generalMessage) => {
	const Toast = Swal.mixin({
		toast: true,
		background: BACKGROUND_COLOR,
		color: TEXT_COLOR,
		position: "top-end",
		showConfirmButton: false,
		timer: MESSAGE_DISPLAY_TIME,
		timerProgressBar: true,

		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	Toast.fire({
		icon: "error",
		text: titleCase(msg),
	});
};

export const confirmationAlert = (onConfirmation) => {
	const alertConfig = {
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: CONFIRM_BUTTON_COLOR,
		cancelButtonColor: CANCEL_BUTTON_COLOR,
		confirmButtonText: CONFIRM_BUTTON_TEXT,
	};

	return Swal.fire(alertConfig).then((result) => {
		if (result.isConfirmed) {
			return onConfirmation();
		} else {
			return Promise.reject("Confirmation rejected");
		}
	});
};
