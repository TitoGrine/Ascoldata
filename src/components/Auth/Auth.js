import axios from 'axios';
import { addToDate } from '../Util/HelperFunc';
import { clearStorage } from '../Util/Storage';

export const setTokens = async (params) => {
	let expirationDate = addToDate(new Date(), 48);
	let bufferDate = addToDate(new Date(), 0, 2);

	localStorage.setItem('expirationDate', expirationDate.getTime());
	localStorage.setItem('bufferDate', bufferDate.getTime());
	localStorage.setItem('authToken', params.access_token);
	localStorage.setItem('refreshToken', params.refresh_token);
};

export const refreshToken = async (updateFunction) => {
	let currDate = new Date().getTime();
	let expirationDate = localStorage.getItem('expirationDate');
	let bufferDate = localStorage.getItem('bufferDate');
	let refreshLink =
		process.env.REACT_APP_MODE.localeCompare('testing') === 0
			? process.env.REACT_APP_TEST_FIREBASE_REFRESH_FUNC
			: process.env.REACT_APP_FIREBASE_REFRESH_FUNC;

	if (bufferDate && currDate < bufferDate) return;

	if (!expirationDate || expirationDate < currDate) {
		clearStorage();
		window.location.reload();
	}

	let headers = {
		refresh_token: localStorage.getItem('refreshToken')
	};

	axios
		.get(refreshLink, { params: headers })
		.then((response) => {
			localStorage.setItem('authToken', response.data.access_token);
			localStorage.setItem('bufferDate', addToDate(new Date(), 0, 2).getTime());

			updateFunction(response.data.access_token);
		})
		.catch((err) => {
			console.log(err);
		});
};
