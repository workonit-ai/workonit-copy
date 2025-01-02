import { getRequest } from '../api';
import { HttpStatusCode } from 'axios';
import { ErrorMessages } from '@constants';

import { throwServerError } from '@utils';

const MODEL_NAME = "/user";

export async function GetCurrentUser() {
	try {
		const result = await getRequest(`${MODEL_NAME}/context`);
		if (result.status === HttpStatusCode.Ok && result.data.status === HttpStatusCode.Ok) {
			return result.data.data;
		} else {
			throw new Error(ErrorMessages.generalMessage);
		}
	} catch (err) {
		return throwServerError(err);
	}
}
