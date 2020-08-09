import axios from 'axios';

export const refreshToken = async (updateFunction) => {
	let headers = {
		refresh_token: localStorage.getItem('refreshToken')
	};

	axios
		.get(process.env.REACT_APP_FIREBASE_REFRESH_FUNC, { params: headers })
		.then((response) => {
			localStorage.setItem('authToken', response.data.access_token);

			updateFunction(response.data.access_token);
		})
		.catch((err) => {
			console.log(err);
		});
};

export const clearStorage = () => {
	localStorage.removeItem('authToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('track_seeds');
	localStorage.removeItem('country');
	localStorage.removeItem('profile-picture');
	localStorage.removeItem('userStats');
};
