import axios from 'axios';

export const refreshToken = async () => {
	let headers = {
		refresh_token: sessionStorage.getItem('refreshToken')
	};

	axios.get(process.env.REACT_APP_FIREBASE_REFRESH_FUNC, { params: headers }).then((response) => {
		console.log(response.data);

		sessionStorage.setItem('authToken', response.data.access_token);

		window.location.reload();
	});
};
