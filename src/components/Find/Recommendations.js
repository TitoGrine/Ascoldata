import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { trackPromise } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { trimLimit } from '../Util/HelperFunc';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import TrackTable from '../Track/TrackTable';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import TrackCards from '../Track/TrackCards';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function Recommendations() {
	const query = new URLSearchParams(useLocation().search);
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ seeds ] = useState(localStorage.getItem('track_seeds'));
	const [ recommendations, setRecommendations ] = useState([]);

	const colapseTable = useMediaQuery({ maxWidth: 700 });

	const getParameters = () => {
		let defaultParameters = {
			limit: limit,
			seed_tracks: seeds
		};

		if (query.get('key')) defaultParameters.target_key = trimLimit(query.get('key'), 0, 13);
		if (query.get('mode')) defaultParameters.target_mode = Math.round(trimLimit(query.get('mode')));

		if (query.get('acousticness')) defaultParameters.target_acousticness = trimLimit(query.get('acousticness'));
		if (query.get('danceability')) defaultParameters.target_danceability = trimLimit(query.get('danceability'));
		if (query.get('energy')) defaultParameters.target_energy = trimLimit(query.get('energy'));
		if (query.get('instrumentalness'))
			defaultParameters.target_instrumentalness = trimLimit(query.get('instrumentalness'));
		if (query.get('liveness')) defaultParameters.target_liveness = trimLimit(query.get('liveness'));
		if (query.get('tempo')) defaultParameters.target_tempo = trimLimit(query.get('tempo'), 0, 250);
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

				if (prev_recommendations && !query.toString().localeCompare(prev_recommendations.query)) {
					setRecommendations(prev_recommendations.results);
					return;
				}

				getData();
			}
		},
		[ authToken ]
	);

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Song Recommendations - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section table-content">
					<LoadingSpinner />
					{recommendations.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<TrackCards results={recommendations} />
							) : (
								<TrackTable
									results={recommendations}
									maxHeight={recommendations.length / limit * 100}
								/>
							)}
							<button className="refresh-button" onClick={getData}>
								Refresh
							</button>
						</React.Fragment>
					)}
					{recommendations.length === 0 && (
						<NoContent
							mainText="Nothing was found for what you were looking for..."
							secondaryText="Try a different combination of attributes 😊"
						/>
					)}
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
