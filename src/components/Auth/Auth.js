import axios from 'axios';

export const refreshToken = async (updateFunction) => {
	let headers = {
		refresh_token: localStorage.getItem('refreshToken')
	};

	axios
		.get(process.env.REACT_APP_FIREBASE_REFRESH_FUNC, { params: headers })
		.then((response) => {
			localStorage.setItem('authToken', response.data.access_token);

			console.log('That stank though..');

			updateFunction(response.data.access_token);
		})
		.catch((err) => {
			console.log(err);
		});
};
