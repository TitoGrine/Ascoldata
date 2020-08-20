import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { getSong } from 'genius-lyrics-api';

import { refreshToken } from '../Auth/Auth';
import { keyBinds } from '../Util/HelperFunc';

import HeaderBar from '../Common/HeaderBar';
import Redirects from '../Common/Redirects';
import StatCard from '../Stats/StatCard';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const track = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ trackLink, setTrackLink ] = useState('');
	const [ trackUri, setTrackUri ] = useState('');
	const [ trackName, setTrackName ] = useState('');
	const [ trackAlbum, setTrackAlbum ] = useState('');
	const [ trackArtists, setTrackArtists ] = useState('');
	const [ trackDuration, setTrackDuration ] = useState('');
	const [ trackPopularity, setTrackPopularity ] = useState('');

	const [ geniusLink, setGeniusLink ] = useState('');

	const [ trackStats, setTrackStats ] = useState({});

	const { promiseInProgress } = usePromiseTracker();

	const formatDuration = (duration_ms) => {
		let seconds = Math.round(duration_ms / 1000);
		let minutes = Math.floor(seconds / 60);

		return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
	};

	const getTrackMetaData = async () => {
		trackPromise(
			spotifyWebApi.getTrack(track).then(
				function(data) {
					setTrackName(data.name);
					setTrackLink(data.external_urls.spotify);
					setTrackUri(data.uri);
					setTrackAlbum(data.album);
					setTrackArtists(data.artists);
					setTrackDuration(data.duration_ms);
					setTrackPopularity(data.popularity);

					// if (geniusLink.length === 0) getGeniusLink();
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getTrackFeatures = async () => {
		trackPromise(
			spotifyWebApi.getAudioFeaturesForTrack(track).then(
				function(data) {
					const avgStats = {
						acousticness: 100 * data.acousticness,
						danceability: 100 * data.danceability,
						energy: 100 * data.energy,
						instrumentalness: 100 * data.instrumentalness,
						liveness: 100 * data.liveness,
						loudness: data.loudness,
						mode: data.mode,
						speechiness: 100 * data.speechiness,
						tempo: data.tempo,
						valence: 100 * data.valence,
						pitchKey: data.key
					};

					setTrackStats(avgStats);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	// const getGeniusLink = async () => {
	// 	const options = {
	// 		apiKey: process.env.REACT_APP_GENIUS_TOKEN,
	// 		title: trackName,
	// 		artist: '',
	// 		optimizeQuery: true
	// 	};

	// 	getSong(options).then(
	// 		function(song) {
	// 			console.log(song);
	// 		},
	// 		function(err) {
	// 			console.log(err);
	// 		}
	// 	);
	// };

	const getData = async () => {
		getTrackMetaData();
		getTrackFeatures();
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getData();
			}
		},
		[ authToken ]
	);

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${trackName.length === 0 ? 'Song' : trackName} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && (
						<React.Fragment>
							<Textfit className="track-title" mode="single" max={36}>
								· {trackName} ·
							</Textfit>
							<a href={trackLink} target="_blank" className="icon-link spotify-icon-link heartbeat">
								<FaSpotify />
							</a>

							<div id="track-info">
								<div>
									<StatCard
										barStat={false}
										title="Album"
										value={
											<Link
												key={trackAlbum.id}
												to={'/album?id=' + trackAlbum.id}
												className="inner-link"
											>
												{trackAlbum.name}
											</Link>
										}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Artist"
										value={
											trackArtists === '' ? (
												''
											) : (
												trackArtists
													.map((artist) => {
														return (
															<Link
																key={artist.id}
																to={'/artist?id=' + artist.id}
																className="inner-link"
															>
																{artist.name}
															</Link>
														);
													})
													.slice(0, 2)
											)
										}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Duration"
										value={formatDuration(trackDuration)}
										units=""
									/>
								</div>
								<div>
									<StatCard
										barStat={false}
										title="Key"
										value={keyBinds[trackStats.pitchKey + 1]}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Mode"
										value={trackStats.mode ? 'Major' : 'Minor'}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Tempo"
										value={Math.round(trackStats.tempo)}
										units="bpm"
									/>
									<StatCard
										barStat={false}
										title="Loudness"
										value={trackStats.loudness ? trackStats.loudness.toFixed(2) : 0}
										units="dB"
									/>
									<StatCard barStat={false} title="Popularity" value={trackPopularity} units="" />
								</div>
							</div>
							<div id="stats">
								<StatCard
									barStat={true}
									title="Acousticness"
									percentage={trackStats.acousticness}
									explanation="acoustExplanation"
									color="seagreen"
								/>
								<StatCard
									barStat={true}
									title="Danceability"
									percentage={trackStats.danceability}
									explanation="danceExplanation"
									color="violet"
								/>
								<StatCard
									barStat={true}
									title="Energy"
									percentage={trackStats.energy}
									explanation="energyExplanation"
									color="orangered"
								/>
								<StatCard
									barStat={true}
									title="Instrumentalness"
									percentage={trackStats.instrumentalness}
									explanation="instrumExplanation"
									color="limegreen"
								/>
								<StatCard
									barStat={true}
									title="Liveness"
									percentage={trackStats.liveness}
									explanation="liveExplanation"
									color="deepskyblue"
								/>
								<StatCard
									barStat={true}
									title="Valence"
									percentage={trackStats.valence}
									explanation="valExplanation"
									color="orange"
								/>
								<div id="mobile-separator" />
							</div>
						</React.Fragment>
					)}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Preview</Tab>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel className="preview_tab">
							<LoadingSpinner />
							{!promiseInProgress && (
								<iframe
									src={`https://embed.spotify.com/?uri=${trackUri}&view=list&theme=black`}
									width="100%"
									height="80%"
									frameBorder="0"
									allowtransparency="true"
									allow="encrypted-media"
								/>
							)}
						</TabPanel>
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

export default Track;
