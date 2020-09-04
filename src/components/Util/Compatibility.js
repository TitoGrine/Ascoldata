import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

const weigths = {
	acousticness: 0.14,
	danceability: 0.14,
	energy: 0.12,
	instrumentalness: 0.16,
	liveness: 0.06,
	speechiness: 0.16,
	tempo: 0.06,
	valence: 0.16
};

const calcStats = (tracks) => {
	return new Promise((resolve, reject) => {
		spotifyWebApi.getAudioFeaturesForTracks(tracks).then(
			function(data) {
				//console.log(data.audio_features);

				const avgStats = {
					acousticness: 0,
					danceability: 0,
					energy: 0,
					instrumentalness: 0,
					liveness: 0,
					speechiness: 0,
					tempo: 0,
					valence: 0
				};

				data.audio_features.forEach((track_info) => {
					avgStats.acousticness += track_info.acousticness / data.audio_features.length;
					avgStats.danceability += track_info.danceability / data.audio_features.length;
					avgStats.energy += track_info.energy / data.audio_features.length;
					avgStats.instrumentalness += track_info.instrumentalness / data.audio_features.length;
					avgStats.liveness += track_info.liveness / data.audio_features.length;
					avgStats.speechiness += track_info.speechiness / data.audio_features.length;
					avgStats.tempo += track_info.tempo / data.audio_features.length;
					avgStats.valence += track_info.valence / data.audio_features.length;
				});

				resolve(avgStats);
			},
			function(err) {
				console.log(err);
			}
		);
	});
};

const getTopTracksStats = (timeRange) => {
	return new Promise((resolve) => {
		spotifyWebApi
			.getMyTopTracks({
				limit: 50,
				offset: 0,
				time_range: timeRange
			})
			.then(
				function(data) {
					let tracks = data.items.map((track) => {
						return track.id;
					});

					if (tracks.length > 0)
						calcStats(tracks).then((stats) => {
							resolve(stats);
						});
				},
				function(err) {
					console.log(err);
				}
			);
	});
};

const getLikedTracksStats = () => {
	return new Promise((resolve) => {
		spotifyWebApi
			.getMySavedTracks({
				limit: 50,
				offset: 0
			})
			.then(
				function(data) {
					let tracks = data.items.map((track) => {
						return track.id;
					});

					if (tracks.length > 0)
						calcStats(tracks).then((stats) => {
							resolve(stats);
						});
				},
				function(err) {
					console.log(err);
				}
			);
	});
};

const getTopGenres = (timeRange, userValues) => {
	return new Promise((resolve) => {
		spotifyWebApi
			.getMyTopArtists({
				limit: 50,
				offset: 0,
				time_range: timeRange
			})
			.then(
				function(data) {
					let avgPopularity = 0;
					data.items.forEach((artist) => {
						artist.genres.forEach((genre) => {
							if (userValues.topGenres[genre]) userValues.topGenres[genre]++;
							else userValues.topGenres[genre] = 1;
						});

						avgPopularity += artist.popularity / data.items.length;
					});

					// Order genres with more than one occurence
					resolve(avgPopularity);
				},
				function(err) {
					console.log(err);
				}
			);
	});
};

export const calcUserValues = async (authToken) => {
	if (localStorage.getItem('compatibilityValues')) return;

	spotifyWebApi.setAccessToken(authToken);

	let div = 0;
	let userValues = {};

	let shortStats = await getTopTracksStats('short_term');
	let mediumStats = await getTopTracksStats('medium_term');
	let longStats = await getTopTracksStats('long_term');
	let likedStats = await getLikedTracksStats();

	if (shortStats) {
		for (var short_key in shortStats) userValues[short_key] = 4 * shortStats[short_key];

		div = 4;
	}

	if (mediumStats) {
		for (var medium_key in mediumStats) userValues[medium_key] += 2 * mediumStats[medium_key];

		div += 2;
	}

	if (longStats) {
		for (var long_key in longStats) userValues[long_key] += longStats[long_key];

		div++;
	}

	if (likedStats) {
		for (var liked_key in likedStats) userValues[liked_key] += 4 * likedStats[liked_key];

		div += 4;
	}

	for (var key in userValues) userValues[key] = div === 0 ? 0 : userValues[key] / div;

	userValues.topGenres = {};

	let avgShortPop = await getTopGenres('short_term', userValues);
	let avgMediumPop = await getTopGenres('medium_term', userValues);
	let avgLongPop = await getTopGenres('long_term', userValues);
	let avgPopularity = 0;
	div = 0;

	console.log(avgShortPop);
	console.log(avgMediumPop);
	console.log(avgLongPop);

	if (avgShortPop >= 0) {
		avgPopularity = 4 * avgShortPop;

		div = 4;
	}

	if (avgMediumPop >= 0) {
		avgPopularity += 4 * avgMediumPop;

		div += 2;
	}

	if (avgLongPop >= 0) {
		avgPopularity += 4 * avgLongPop;

		div++;
	}

	userValues.popularity = div === 0 ? 0 : avgPopularity / div;

	for (var genre in userValues.topGenres) if (userValues.topGenres[genre] < 3) delete userValues.topGenres[genre];

	localStorage.setItem('compatibilityValues', JSON.stringify(userValues));
};

const getArtistsGenres = async (artists) => {
	return new Promise((resolve) => {
		let authToken = localStorage.getItem('authToken');

		if (!authToken) resolve([]);

		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi.getArtists(artists).then(
			function(data) {
				let genres = [];

				data.artists.forEach((artist) => {
					genres = [ ...genres, ...artist.genres ];
				});

				resolve(genres);
			},
			function(err) {
				console.log(err);

				resolve([]);
			}
		);
	});
};

export const evalCompatibility = async (values, artists) => {
	let penalty = 0;
	let target = localStorage.getItem('compatibilityValues');

	if (!target || !values) return -1;

	target = JSON.parse(target);

	for (var key in target) {
		if (key === 'topGenres') continue;

		var diff = Math.max(target[key] - values[key], values[key] - target[key]);

		penalty += key === 'tempo' ? 0.04 * diff / 250 : weigths[key] * diff;
	}

	let compatibility = 100 - penalty + penalty * (1 - penalty / 20);

	let genres = await getArtistsGenres(artists);
	let topGenres = target['topGenres'];
	let occurences = 0;
	let totalOccurences = 1;

	for (var genre in topGenres) totalOccurences += topGenres[genre];

	genres.forEach((genre) => {
		if (Object.prototype.hasOwnProperty.call(topGenres, genre)) occurences += parseInt(topGenres[genre]);
	});

	compatibility += occurences-- * (100 - compatibility) / totalOccurences;

	console.log(compatibility);
};
