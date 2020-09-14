// import axios from 'axios';

const cleanQuery = (track, artist) => {
	return `${track} ${artist}`
		.toLowerCase()
		.replace(/ *\([^)]*\) */g, '')
		.replace(/ *\[[^\]]*]/, '')
		.replace(/feat\.|ft\./g, '')
		.replace(/\s+/g, ' ')
		.trim();
};

const likelyMatch = (original, retrieved) => {
	let o = original.toLowerCase();
	let r = retrieved.toLowerCase();

	return o.includes(r) || r.includes(o);
};

export const getGeniusLink = (track, artist) => {
	return new Promise((resolve, reject) => {
		let requestURL = `https://api.genius.com/search?q=${encodeURI(cleanQuery(track, artist))}&access_token=${process
			.env.REACT_APP_GENIUS_TOKEN}`;

		// console.log(requestURL);

		fetch(requestURL)
			.then((response) => {
				if (response.status === 200) return response.json();
				else reject('Lyrics URL not found.');
			})
			.then((json) => {
				// console.log(json);

				json.response.hits.forEach((hit) => {
					if (likelyMatch(track, hit.result.title) || likelyMatch(artist, hit.result.primary_artist.name))
						resolve(hit.result.url);
				});

				reject('No confident match found.');
			})
			.catch((err) => reject('Lyrics URL not found.'));
	});
};
