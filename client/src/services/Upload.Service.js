import { HttpStatusCode } from 'axios';
import { postFormDataRequest } from '../api';
import { ErrorMessages } from '@constants';

import { throwServerError } from '@utils';

const MODEL_NAME = "/upload";

export async function UploadFileOnServer(file) {
	try {
		let formData = new FormData();
		formData.append("file", file);

		const result = await postFormDataRequest(`${MODEL_NAME}`, formData);
		if (result.status === HttpStatusCode.Ok) {
			return result.data;
		} else {
			throw new Error(ErrorMessages.generalMessage);
		}
	} catch (err) {
		return throwServerError(err);
	}
}
