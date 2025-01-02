import { HttpStatusCode } from 'axios';
import { getRequest } from '../api';
import { ErrorMessages } from '@constants';

import { throwServerError } from '@utils';

const MODEL_NAME = "/public";

export async function GetPublicURl() {
	try {
		const result = await getRequest(`${MODEL_NAME}/url`);
		if (result.status === HttpStatusCode.Ok && result.data.status === HttpStatusCode.Ok) {
			return result.data.data;
		} else {
			throw new Error(ErrorMessages.generalMessage);
		}
	} catch (err) {
		return throwServerError(err);
	}
}
