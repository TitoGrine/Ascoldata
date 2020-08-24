import { createElement } from 'react';

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
		? ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2)
		: hours + 'h ' + ('00' + minutes % 60).slice(-2) + 'min';
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

export const getCountryFromISOCode = (ISOcode) => {
	let name = ISOcodes[ISOcode];

	return name ? name : ISOcode;
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
		'Mode indicates the modality (major or minor) of a strack, that is, the type of scale from which its melodic content is derived.'
};

const ISOcodes = {
	AF: 'Afghanistan',
	AL: 'Albania',
	DZ: 'Algeria',
	AS: 'American Samoa',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguilla',
	AQ: 'Antarctica',
	AG: 'Antigua and Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AW: 'Aruba',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaijan',
	BS: 'Bahamas',
	BH: 'Bahrain',
	BD: 'Bangladesh',
	BB: 'Barbados',
	BY: 'Belarus',
	BE: 'Belgium',
	BZ: 'Belize',
	BJ: 'Benin',
	BM: 'Bermuda',
	BT: 'Bhutan',
	BO: 'Bolivia',
	BQ: 'Bonaire, Sint Eustatius and Saba',
	BA: 'Bosnia and Herzegovina',
	BW: 'Botswana',
	BV: 'Bouvet Island',
	BR: 'Brazil',
	IO: 'British Indian Ocean Territory',
	BN: 'Brunei Darussalam',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	BI: 'Burundi',
	CV: 'Cabo Verde',
	KH: 'Cambodia',
	CM: 'Cameroon',
	CA: 'Canada',
	KY: 'Cayman Islands',
	CF: 'Central African Republic',
	TD: 'Chad',
	CL: 'Chile',
	CN: 'China',
	CX: 'Christmas Island',
	CC: 'Cocos Islands',
	CO: 'Colombia',
	KM: 'Comoros',
	CD: 'Congo',
	CG: 'Congo',
	CK: 'Cook Islands',
	CR: 'Costa Rica',
	CI: "Cote d'Ivoire",
	HR: 'Croatia',
	CU: 'Cuba',
	CW: 'Cura&ccedil;ao',
	CY: 'Cyprus',
	CZ: 'Czechia',
	DK: 'Denmark',
	DJ: 'Djibouti',
	DM: 'Dominica',
	DO: 'Dominican Republic',
	EC: 'Ecuador',
	EG: 'Egypt',
	SV: 'El Salvador',
	GQ: 'Equatorial Guinea',
	ER: 'Eritrea',
	EE: 'Estonia',
	SZ: 'Eswatini',
	ET: 'Ethiopia',
	FK: 'Falkland Islands',
	FO: 'Faroe Islands',
	FJ: 'Fiji',
	FI: 'Finland',
	FR: 'France',
	GF: 'French Guiana',
	PF: 'French Polynesia',
	TF: 'French Southern Territories',
	GA: 'Gabon',
	GM: 'Gambia',
	GE: 'Georgia',
	DE: 'Germany',
	GH: 'Ghana',
	GI: 'Gibraltar',
	GR: 'Greece',
	GL: 'Greenland',
	GD: 'Grenada',
	GP: 'Guadeloupe',
	GU: 'Guam',
	GT: 'Guatemala',
	GG: 'Guernsey',
	GN: 'Guinea',
	GW: 'Guinea-Bissau',
	GY: 'Guyana',
	HT: 'Haiti',
	HM: 'Heard Island and McDonald Islands',
	VA: 'Holy See',
	HN: 'Honduras',
	HK: 'Hong Kong',
	HU: 'Hungary',
	IS: 'Iceland',
	IN: 'India',
	ID: 'Indonesia',
	IR: 'Iran',
	IQ: 'Iraq',
	IE: 'Ireland',
	IM: 'Isle of Man',
	IL: 'Israel',
	IT: 'Italy',
	JM: 'Jamaica',
	JP: 'Japan',
	JE: 'Jersey',
	JO: 'Jordan',
	KZ: 'Kazakhstan',
	KE: 'Kenya',
	KI: 'Kiribati',
	KP: 'North Korea',
	KR: 'South Korea',
	KW: 'Kuwait',
	KG: 'Kyrgyzstan',
	LA: "Lao People's Democratic Republic",
	LV: 'Latvia',
	LB: 'Lebanon',
	LS: 'Lesotho',
	LR: 'Liberia',
	LY: 'Libya',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MO: 'Macao',
	MK: 'Republic of North Macedonia',
	MG: 'Madagascar',
	MW: 'Malawi',
	MY: 'Malaysia',
	MV: 'Maldives',
	ML: 'Mali',
	MT: 'Malta',
	MH: 'Marshall Islands',
	MQ: 'Martinique',
	MR: 'Mauritania',
	MU: 'Mauritius',
	YT: 'Mayotte',
	MX: 'Mexico',
	FM: 'Micronesia',
	MD: 'Moldova',
	MC: 'Monaco',
	MN: 'Mongolia',
	ME: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Morocco',
	MZ: 'Mozambique',
	MM: 'Myanmar',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Netherlands',
	NC: 'New Caledonia',
	NZ: 'New Zealand',
	NI: 'Nicaragua',
	NE: 'Niger',
	NG: 'Nigeria',
	NU: 'Niue',
	NF: 'Norfolk Island',
	MP: 'Northern Mariana Islands',
	NO: 'Norway',
	OM: 'Oman',
	PK: 'Pakistan',
	PW: 'Palau',
	PS: 'Palestine, State of',
	PA: 'Panama',
	PG: 'Papua New Guinea',
	PY: 'Paraguay',
	PE: 'Peru',
	PH: 'Philippines',
	PN: 'Pitcairn',
	PL: 'Poland',
	PT: 'Portugal',
	PR: 'Puerto Rico',
	QA: 'Qatar',
	RO: 'Romania',
	RU: 'Russian Federation',
	RW: 'Rwanda',
	SH: 'Saint Helena, Ascension and Tristan da Cunha',
	KN: 'Saint Kitts and Nevis',
	LC: 'Saint Lucia',
	MF: 'Saint Martin',
	PM: 'Saint Pierre and Miquelon',
	VC: 'Saint Vincent and the Grenadines',
	WS: 'Samoa',
	SM: 'San Marino',
	ST: 'Sao Tome and Principe',
	SA: 'Saudi Arabia',
	SN: 'Senegal',
	RS: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leone',
	SG: 'Singapore',
	SX: 'Sint Maarten',
	SK: 'Slovakia',
	SI: 'Slovenia',
	SB: 'Solomon Islands',
	SO: 'Somalia',
	ZA: 'South Africa',
	GS: 'South Georgia and the South Sandwich Islands',
	SS: 'South Sudan',
	ES: 'Spain',
	LK: 'Sri Lanka',
	SD: 'Sudan',
	SR: 'Suriname',
	SJ: 'Svalbard and Jan Mayen',
	SE: 'Sweden',
	CH: 'Switzerland',
	SY: 'Syrian Arab Republic',
	TW: 'Taiwan',
	TJ: 'Tajikistan',
	TZ: 'Tanzania',
	TH: 'Thailand',
	TL: 'Timor-Leste',
	TG: 'Togo',
	TK: 'Tokelau',
	TO: 'Tonga',
	TT: 'Trinidad and Tobago',
	TN: 'Tunisia',
	TR: 'Turkey',
	TM: 'Turkmenistan',
	TC: 'Turks and Caicos Islands',
	TV: 'Tuvalu',
	UG: 'Uganda',
	UA: 'Ukraine',
	AE: 'United Arab Emirates',
	GB: 'United Kingdom',
	UM: 'United States Minor Outlying Islands',
	US: 'United States of America',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VU: 'Vanuatu',
	VE: 'Venezuela',
	VN: 'Viet Nam',
	VG: 'Virgin Islands',
	VI: 'Virgin Islands (U.S.)',
	WF: 'Wallis and Futuna',
	EH: 'Western Sahara',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabwe'
};
