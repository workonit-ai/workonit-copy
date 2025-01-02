import { HttpStatusCode } from 'axios';
import { throwServerError } from '@utils';
import { postRequest } from '../api';
import { ErrorMessages } from '@constants';

const MODEL_NAME = "/translation";

export async function Translate(message, language) {
	try {
		let payload = { message, language };
		const result = await postRequest(`${MODEL_NAME}/translate`, payload);
		if (result.status === HttpStatusCode.Ok) return result.data.user;
		else throw new Error(ErrorMessages.generalMessage);
	} catch (err) {
		return throwServerError(err);
	}
}


export async function Detect_Language(input) {
	try {
		let payload = { message: input };
		const result = await postRequest(`${MODEL_NAME}/detect_language`, payload);

		if (result.status === HttpStatusCode.Ok) return result.data.user;
		else throw new Error(ErrorMessages.generalMessage);
	} catch (err) {
		return throwServerError(err);
	}
}


export function Is_Hebrew(message) {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(message);
}
