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
