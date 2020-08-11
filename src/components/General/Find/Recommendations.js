import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../../Auth/Auth';
import { trimLimit } from '../../HelperFunc';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../../Redirects';
import TrackTable from '../Track/TrackTable';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import TrackCards from '../Track/TrackCards';
import HeaderBar from '../../HeaderBar';
import LoadingSpinner from '../../LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function Recommendations() {
	const query = new URLSearchParams(useLocation().search);
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ seeds ] = useState(localStorage.getItem('track_seeds'));
	const [ recommendations, setRecommendations ] = useState([]);

	const colapseTable = useMediaQuery({ maxWidth: 700 });

	const { promiseInProgress } = usePromiseTracker();

	const getKey = () => {
		let key = {};
	};

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

		trackPromise(
			spotifyWebApi.getRecommendations(getParameters()).then(
				function(data) {
					// console.log(data);
					setRecommendations(data.tracks);
					localStorage.setItem('track_seeds', data.seeds.map((seed) => seed.id));

					const recommendations = {
						query: query.toString(),
						results: data.tracks
					};

					localStorage.setItem('recommendations', JSON.stringify(recommendations));
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	useEffect(
		() => {
			if (authToken) {
				let prev_recommendations = JSON.parse(localStorage.getItem('recommendations'));

				if (!query.toString().localeCompare(prev_recommendations.query)) {
					setRecommendations(prev_recommendations.results);
					return;
				}

				getData();
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Song Recommendations - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum" className="recommendation-content">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress &&
						recommendations.length > 0 &&
						(colapseTable ? (
							<TrackCards results={recommendations} />
						) : (
							<TrackTable results={recommendations} />
						))}
					<button className="find-button" onClick={getData}>
						Refresh
					</button>
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
