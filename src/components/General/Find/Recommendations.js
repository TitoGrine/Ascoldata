import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

import { refreshToken } from '../../Auth/Auth';
import { trimLimit } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';

const spotifyWebApi = new Spotify();

function Recommendations() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const [ toggled, setToggled ] = useState('closed');
	const [ seeds ] = useState(sessionStorage.getItem('track_seeds'));
	const [ recommendations, setRecommendations ] = useState([]);

	const getParameters = () => {
		let defaultParameters = {
			limit: limit,
			seed_tracks: seeds
		};

		if (query.get('key')) defaultParameters.target_key = trimLimit(query.get('key'), 0, 13);
		if (query.get('mode')) defaultParameters.target_mode = Math.round(trimLimit(query.get('mode'), 0, 1));

		if (query.get('acousticness')) defaultParameters.target_acousticness = trimLimit(query.get('acousticness'));
		if (query.get('danceability')) defaultParameters.target_danceability = trimLimit(query.get('danceability'));
		if (query.get('energy')) defaultParameters.target_energy = trimLimit(query.get('energy'));
		if (query.get('instrumentalness'))
			defaultParameters.target_instrumentalness = trimLimit(query.get('instrumentalness'));
		if (query.get('liveness')) defaultParameters.target_liveness = trimLimit(query.get('liveness'));
		if (query.get('loudness')) defaultParameters.target_loudness = trimLimit(query.get('loudness'));
		if (query.get('popularity')) defaultParameters.target_popularity = trimLimit(query.get('popularity'), 0, 100);
		if (query.get('speechiness')) defaultParameters.target_speechiness = trimLimit(query.get('speechiness'));
		if (query.get('valence')) defaultParameters.target_valence = trimLimit(query.get('valence'));

		return defaultParameters;
	};

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi.getRecommendations(getParameters()).then(
			function(data) {
				// console.log(data);
				setRecommendations(data.tracks);
				sessionStorage.setItem('track_seeds', data.seeds.map((seed) => seed.id));
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					{recommendations.length > 0 && <TrackTable results={recommendations} />}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="" />
						</TabPanel>
					</Tabs>
				</div>
				<SideToggle
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default Recommendations;
