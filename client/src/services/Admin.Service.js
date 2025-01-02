import { getRequest } from '../api';
import { HttpStatusCode } from 'axios';
import { throwServerError } from '@utils';
import { ErrorMessages } from '@constants';

const MODEL_NAME = "/admin";

export async function GetAllUsersByAdmin() {
	try {
		const result = await getRequest(`${MODEL_NAME}/users`);
		if (result.status === HttpStatusCode.Ok && result.data.status === HttpStatusCode.Ok) {
			return result.data.data;
		} else {
			throw new Error(ErrorMessages.generalMessage);
		}
	} catch (err) {
		return throwServerError(err);
	}
}
