import axios from 'axios';

const cleanQuery = (track, artist) => {
	return `${track} ${artist}`
		.toLowerCase()
		.replace(/ *\([^)]*\) */g, '')
		.replace(/ *\[[^\]]*]/, '')
		.replace(/feat.|ft./g, '')
		.replace(/\s+/g, ' ')
		.trim();
};

export const getGeniusLink = (track, artist) => {
	return new Promise((resolve) => {
		let requestURL = `https://api.genius.com/search?q=${cleanQuery(track, artist)}`;

		const headers = {
			Authorization: `Bearer ${process.env.REACT_APP_GENIUS_TOKEN}`
		};

		axios.get(requestURL, { headers }).then(
			function(data) {
				console.log(data);
			},
			function(err) {
				console.log(err);
			}
		);
	});
};
