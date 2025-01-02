import { HttpStatusCode } from 'axios';
import { throwServerError } from '@utils';
import { postRequest } from '../api';
import { ErrorMessages } from '@constants';

const MODEL_NAME = "/user";

export async function SignIn(username, password) {
	try {
		let payload = { user: { username, password } };
		const result = await postRequest(`${MODEL_NAME}/login`, payload);

		if (result.status === HttpStatusCode.Ok) return result.data.user;
		else throw new Error(ErrorMessages.generalMessage);
	} catch (err) {
		return throwServerError(err);
	}
}
