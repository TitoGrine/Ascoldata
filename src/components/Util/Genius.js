// import axios from 'axios';

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
	return new Promise((resolve, reject) => {
		let requestURL = `https://api.genius.com/search?q=${encodeURI(cleanQuery(track, artist))}&access_token=${process
			.env.REACT_APP_GENIUS_TOKEN}`;

		fetch(requestURL)
			.then((response) => {
				if (response.status === 200) return response.json();
				else reject('Lyrics URL not found.');
			})
			.then((json) => {
				if (json.response.hits.length > 0) {
					resolve(json.response.hits[0].result.url);
				}
			})
			.catch((err) => reject('Lyrics URL not found.'));
	});
};
