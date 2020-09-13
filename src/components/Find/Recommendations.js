import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { useMediaQuery } from 'react-responsive';
import { Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';
import { trimLimit } from '../Util/HelperFunc';
import { ascoldata_cover_art } from '../Util/DefCoverArt';

import Redirects from '../Common/Redirects';
import TrackTable from '../Track/TrackTable';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import TrackCards from '../Track/TrackCards';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function Recommendations() {
	const limit = 15;

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ query ] = useState(new URLSearchParams(useLocation().search));
	const [ showSuccessAlert, setShowSuccessAlert ] = useState(false);
	const [ showFailAlert, setShowFailAlert ] = useState(false);
	const [ seeds, setSeeds ] = useState(localStorage.getItem('track_seeds'));
	const [ recommendations, setRecommendations ] = useState([]);

	const { promiseInProgress } = usePromiseTracker();

	const colapseTable = useMediaQuery({ maxWidth: 700 });

	const autoDismiss = async () => {
		window.setTimeout(() => {
			setShowSuccessAlert(false);
			setShowFailAlert(false);
		}, 5000);
	};

	const createPlaylist = async () => {
		let userId = localStorage.getItem('userId');
		let currDate = new Date();

		if (!userId || recommendations.length === 0) return;

		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi
			.createPlaylist(userId, {
				name: 'Ascoldata Recommendations',
				public: false,
				description: `Playlist create through Ascoldata on ${currDate.getDate()}/${currDate.getMonth() +
					1}/${currDate.getFullYear()} at ${currDate.getHours()}:${currDate.getMinutes()}.`
			})
			.then(
				function(response) {
					let tracks = recommendations.map((track) => track.uri);

					spotifyWebApi
						.addTracksToPlaylist(response.id, '', {
							uris: tracks
						})
						.then(
							function(response) {
								// console.log(response);
								setShowSuccessAlert(true);
								autoDismiss();

								ReactGA.event({
									category: 'Creation',
									action: 'Recommendations playlist was successfully created.',
									label: 'Created playlist'
								});
							},
							function(err) {
								console.log(err);
								setShowFailAlert(true);
								autoDismiss();

								ReactGA.event({
									category: 'Fail',
									action: 'Recommendations playlist creation failed. Error adding tracks.',
									label: 'Failed creating playlist'
								});

								if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
							}
						);

					spotifyWebApi.uploadCustomPlaylistCoverImage(response.id, ascoldata_cover_art).then(
						function(response) {
							// console.log(response);
						},
						function(err) {
							console.log(err);
						}
					);
				},
				function(err) {
					console.log(err);
					setShowFailAlert(true);
					autoDismiss();

					ReactGA.event({
						category: 'Fail',
						action: 'Recommendations playlist creation failed. Error creating playlist.',
						label: 'Failed creating playlist'
					});

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			);
	};

	const getParameters = useCallback(
		() => {
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
			if (query.get('popularity'))
				defaultParameters.target_popularity = trimLimit(query.get('popularity'), 0, 100);
			if (query.get('speechiness')) defaultParameters.target_speechiness = trimLimit(query.get('speechiness'));
			if (query.get('valence')) defaultParameters.target_valence = trimLimit(query.get('valence'));

			return defaultParameters;
		},
		[ query, seeds ]
	);

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi.getRecommendations(getParameters()).then(
					function(data) {
						// console.log(data);
						setRecommendations(data.tracks);
						let new_seeds = data.seeds.map((seed) => seed.id);
						localStorage.setItem('track_seeds', new_seeds);
						setSeeds((seeds) => new_seeds);

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
		},
		[ authToken, query, getParameters ]
	);

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
		[ authToken, query, getData ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/recommendations');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Song Recommendations - Ascoldata`}</title>
			</Helmet>
			<Alert
				variant="warning"
				show={showFailAlert}
				onClose={() => {
					setShowFailAlert(false);
				}}
				dismissible
			>
				<Alert.Heading>Ups!</Alert.Heading>
				<p>There was a problem creating your playlist. Sorry about that...</p>
			</Alert>
			<Alert
				variant="success"
				show={showSuccessAlert}
				onClose={() => {
					setShowSuccessAlert(false);
				}}
				dismissible
			>
				<Alert.Heading>Yay!</Alert.Heading>
				<p>Your playlist has been created. Hope you enjoy!</p>
			</Alert>
			<HeaderBar />
			<div id="corporum">
				<section
					className="content-section table-content"
					ref={table}
					onClick={() => {
						if (toggled.localeCompare('toggled') === 0) toggleButton.current.click();
					}}
				>
					<LoadingSpinner />
					{!promiseInProgress &&
					recommendations.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<TrackCards results={recommendations} />
							) : (
								<TrackTable
									results={recommendations}
									maxHeight={recommendations.length / limit * 100}
								/>
							)}
							<div className="recommendations-buttons">
								<button
									className="refresh-button"
									onClick={() => {
										ReactGA.event({
											category: 'Interaction',
											action: 'Clicked button to refresh recommended songs.',
											label: 'Button event'
										});
										getData();
									}}
								>
									Refresh
								</button>
								{authToken && (
									<button
										className="create-playlist-button"
										onClick={() => {
											ReactGA.event({
												category: 'Interaction',
												action: 'Clicked button to create playlist.',
												label: 'Button event'
											});
											createPlaylist();
										}}
									>
										Create Playlist
									</button>
								)}
							</div>
						</React.Fragment>
					)}
					{!promiseInProgress &&
					recommendations.length === 0 && (
						<NoContent
							mainText="Nothing was found for what you were looking for..."
							secondaryText="Try a different combination of attributes 😊"
						/>
					)}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs defaultIndex={1}>
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
					ref={toggleButton}
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default Recommendations;
