export const trimLimit = (number, min = 0, max = 1) => {
	if (isNaN(number)) return 0;

	return Math.max(min, Math.min(parseFloat(number), max));
};

export const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

export const addToDate = (date, hours, minutes = 0) => {
	return new Date(date.getTime() + (hours * 60 + minutes) * 60000);
};

export const formatDuration = (duration_ms) => {
	let seconds = Math.round(duration_ms / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	return hours === 0
		? `${('00' + minutes).slice(-2)}:${('00' + seconds % 60).slice(-2)}`
		: `${hours}h ${('00' + minutes % 60).slice(-2)}min`;
};

export const getExplanation = (explanation) => {
	return explanations[explanation] ? explanations[explanation] : 'No explanation...';
};

/**
 * Pretty weird but clever way to decode a string with special HTML entities.
 * 
 * @param {String} encodedString 
 */
export const decodeString = (encodedString) => {
	let temp = document.createElement('textarea');
	temp.innerHTML = encodedString;

	return temp.value;
};

export const keyBinds = [
	'Unknown',
	'C',
	'C♯, D♭',
	'D',
	'D♯, E♭',
	'E',
	'F',
	'F♯, G♭',
	'G',
	'G♯, A♭',
	'A',
	'A♯, B♭',
	'B'
];

const explanations = {
	acoustExplanation: 'Acousticness measures how acoustic the songs are.',
	danceExplanation:
		'Danceability describes how suitable the songs are for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.',
	energyExplanation:
		'Energy represents a perceptual measure of intensity and activity. Typically, energetic songs feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
	instrumExplanation: 'Instrumentalness measures how likely the songs are to not contain vocals.',
	liveExplanation:
		'Liveness predicts the likelyhood the songs are played live, that is, in the presence of an audience.',
	valExplanation:
		'Valence measures how positive the songs are. High valence means positive/happier songs, while low valence represents more negative/sadder songs.',
	speechExplanation: 'Speechiness detects the presence of spoken words in a track.',
	popExplanation:
		'A measure of how popular the track is. The algorithm is based mainly by the total number of plays the track has had and how recent those tracks are.',
	tempoExplanation:
		'The overall estimated tempo of a track in beats per minute (BPM). Tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
	keyExplanation: 'The key or pitch class the track is in.',
	modeExplanation:
		'Mode indicates the modality (major or minor) of a track, that is, the type of scale from which its melodic content is derived.'
};
