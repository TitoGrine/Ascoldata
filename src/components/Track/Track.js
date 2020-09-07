import React, { useState, useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Helmet } from 'react-helmet';
import genius_logo from '../../assets/images/genius-logo2.svg';

import { refreshToken } from '../Auth/Auth';
import { keyBinds, formatDuration } from '../Util/HelperFunc';
import { getGeniusLink } from '../Util/Genius';

import HeaderBar from '../Common/HeaderBar';
import Redirects from '../Common/Redirects';
import StatCard from '../Stats/StatCard';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import LoadingSpinner from '../Common/LoadingSpinner';

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

	const getTrackFeatures = useCallback(
		() => {
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
		},
		[ track ]
	);

	const getData = useCallback(
		() => {
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

						if (geniusLink.length === 0)
							getGeniusLink(data.name, data.artists.length > 0 ? data.artists[0].name : '').then(
								function(response) {
									setGeniusLink(response);
								},
								function(reject) {
									console.log(reject);
								}
							);
						getTrackFeatures(data.artists.map((artist) => artist.id));
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ track, geniusLink, getTrackFeatures ]
	);

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getData();
			}
		},
		[ authToken, getData ]
	);

	useEffect(() => {
		ReactGA.pageview('/track');
	});

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
								· {trackName.length > 25 ? `${trackName.slice(0, 25)}...` : trackName} ·
							</Textfit>
							{geniusLink.length > 0 && (
								<a
									href={geniusLink}
									target="_blank"
									rel="noopener noreferrer"
									className="icon-link genius-icon-link heartbeat"
									onClick={() => {
										ReactGA.event({
											category: 'Interaction',
											action: 'Clicked on Genius link for track.',
											label: 'Link Event'
										});
									}}
								>
									<img src={genius_logo} alt="Genius's logo." />
								</a>
							)}
							<a
								href={trackLink}
								target="_blank"
								rel="noopener noreferrer"
								className="icon-link spotify-icon-link heartbeat"
								onClick={() => {
									ReactGA.event({
										category: 'Interaction',
										action: 'Clicked on Spotify link for track.',
										label: 'Link Event'
									});
								}}
							>
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
									title="track_preview"
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
