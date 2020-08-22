import axios from 'axios';
import { addToDate } from '../Util/HelperFunc';

export const refreshToken = async (updateFunction) => {
	let currDate = new Date().getTime();
	let expirationDate = localStorage.getItem('expirationDate');
	let bufferDate = localStorage.getItem('bufferDate');

	if (bufferDate && currDate < bufferDate) return;

	if (!expirationDate || expirationDate < currDate) {
		clearStorage();
		window.location.reload();
	}

	let headers = {
		refresh_token: localStorage.getItem('refreshToken')
	};

	axios
		.get(process.env.REACT_APP_FIREBASE_REFRESH_FUNC, { params: headers })
		.then((response) => {
			localStorage.setItem('authToken', response.data.access_token);
			localStorage.setItem('bufferDate', addToDate(new Date(), 0, 2).getTime());

			updateFunction(response.data.access_token);
		})
		.catch((err) => {
			console.log(err);
		});
};

export const clearStorage = () => {
	localStorage.removeItem('authToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('userId');
	localStorage.removeItem('country');
	localStorage.removeItem('track_seeds');
	localStorage.removeItem('recommendations');
	localStorage.removeItem('compatibilityValues');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('bufferDate');
};
