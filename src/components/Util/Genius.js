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
	return new Promise((resolve) => {
		let requestURL = `https://api.genius.com/search?q=${encodeURI(cleanQuery(track, artist))}`;

		const headers = {
			Authorization: `Bearer ${process.env.REACT_APP_GENIUS_TOKEN}`,
			'Access-Control-Allow-Origin': 'https://feature-genius-lyrics--wonderful-lewin-0aab42.netlify.app',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
			'Access-Control-Allow-Headers': '*'
			// 'Content-Type': 'application/x-www-form-urlencoded'
		};

		// axios.get(requestURL, { mode: 'no-cors', headers: headers }).then(
		// 	function(data) {
		// 		console.log(data);
		// 	},
		// 	function(err) {
		// 		console.log(err);
		// 	}
		// );

		// try {
		// 	fetch(requestURL, {
		// 		method: 'GET',
		// 		// credentials: 'include',
		// 		headers: headers
		// 	})
		// 		.then((response) => response.json())
		// 		.then((json) => {
		// 			console.log(JSON.stringify(json));
		// 		});
		// } catch (err) {
		// 	console.log(err);
		// }

		fetch(requestURL, { headers }).then((response) => response.json()).then((json) => {
			console.log(JSON.stringify(json));
		});

		resolve();
	});
};
