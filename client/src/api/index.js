import axios from 'axios';
import { environmentUrls, ErrorMessages } from '@constants';

const formDataRequestHeaders = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};

const jsonRequestHeaders = {
	headers: {
		"Content-Type": "application/json",
	},
};

axios.defaults.baseURL = environmentUrls.api_url;
// axios.defaults.timeout = 300000;

axios.interceptors.request.use(
	async (config) => {
		const idToken = localStorage.getItem("token");
		if (idToken) config.headers.Authorization = `Bearer ${idToken}`;

		config.timeoutErrorMessage = ErrorMessages.timeoutMessage;
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		if (response.data && response.data.data) {
			response.data = response.data.data;
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const getRequest = (
	url,
	params = {},
	config = {
		...jsonRequestHeaders,
	}
) => axios.get(url, { params, ...config });

export const postRequest = (
	url,
	data,
	config = {
		...jsonRequestHeaders,
	}
) => axios.post(url, data, config);

export const putRequest = (
	url,
	data,
	config = {
		...jsonRequestHeaders,
	}
) => axios.put(url, data, config);

export const deleteRequest = (
	url,
	config = {
		...jsonRequestHeaders,
	}
) => axios.delete(url, config);

export const getFormDataRequest = (
	url,
	params = {},
	config = {
		...formDataRequestHeaders,
	}
) => axios.get(url, { params, ...config });

export const postFormDataRequest = (
	url,
	data,
	config = {
		...formDataRequestHeaders,
	}
) => axios.post(url, data, config);

export const putFormDataRequest = (
	url,
	data,
	config = {
		...formDataRequestHeaders,
	}
) => axios.put(url, data, config);

export const deleteFormDataRequest = (
	url,
	config = {
		...formDataRequestHeaders,
	}
) => axios.delete(url, config);
