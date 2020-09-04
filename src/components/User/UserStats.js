import React, { useState, useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

import { formatDuration } from '../Util/HelperFunc';
import { refreshToken } from '../Auth/Auth';

import Redirects from '../Common/Redirects';
import StatCard from '../Stats/StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import { Helmet } from 'react-helmet';
import LoadingSpinner from '../Common/LoadingSpinner';
import RadioInput from '../Common/RadioInput';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function UserStats() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();

	const [ toggled, setToggled ] = useState('nothing');
	const [ existsData, setExistsData ] = useState(false);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ stats, setStats ] = useState('');
	const [ topGenres, setTopGenres ] = useState([]);
	const [ timeRange, setTimeRange ] = useState(query.get('time_range'));

	const { promiseInProgress } = usePromiseTracker();

	const calcUserStats = (tracks, avgPopularity) => {
		trackPromise(
			spotifyWebApi.getAudioFeaturesForTracks(tracks).then(
				function(data) {
					//console.log(data.audio_features);

					const avgStats = {
						acousticness: 0,
						danceability: 0,
						duration_ms: 0,
						energy: 0,
						instrumentalness: 0,
						liveness: 0,
						loudness: 0,
						mode: 0,
						speechiness: 0,
						tempo: 0,
						valence: 0,
						popularity: avgPopularity
					};

					data.audio_features.forEach((track_info) => {
						avgStats.acousticness += 100 * track_info.acousticness / data.audio_features.length;
						avgStats.danceability += 100 * track_info.danceability / data.audio_features.length;
						avgStats.duration_ms += track_info.duration_ms;
						avgStats.energy += 100 * track_info.energy / data.audio_features.length;
						avgStats.instrumentalness += 100 * track_info.instrumentalness / data.audio_features.length;
						avgStats.liveness += 100 * track_info.liveness / data.audio_features.length;
						avgStats.loudness += track_info.loudness / data.audio_features.length;
						avgStats.mode += track_info.mode;
						avgStats.speechiness += 100 * track_info.speechiness / data.audio_features.length;
						avgStats.tempo += track_info.tempo / data.audio_features.length;
						avgStats.valence += 100 * track_info.valence / data.audio_features.length;
					});

					setStats(avgStats);

					//console.log(avgStats);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getData = useCallback(
		() => {
			trackPromise(
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

							let avgPopularity =
								data.items.reduce((total, track) => {
									return total + track.popularity;
								}, 0) / data.items.length;

							if (tracks.length > 0) {
								calcUserStats(tracks, avgPopularity);
								setExistsData(true);
							}
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
			);

			trackPromise(
				spotifyWebApi
					.getMyTopArtists({
						limit: 50,
						offset: 0,
						time_range: timeRange
					})
					.then(
						function(data) {
							let genres = {};

							data.items.forEach((artist) => {
								artist.genres.forEach((genre) => {
									if (genres[genre]) genres[genre]++;
									else genres[genre] = 1;
								});
							});

							// Order genres with more than one occurence
							setTopGenres(
								Object.keys(genres)
									.filter((genre) => {
										return genres[genre] > 1;
									})
									.sort(function(a, b) {
										return genres[b] - genres[a];
									})
									.slice(0, 4)
							);
						},
						function(err) {
							console.log(err);
						}
					)
			);
		},
		[ timeRange ]
	);

	const updateTimeRange = (ev) => {
		setStats([]);
		history.push(`/user_stats?time_range=${ev.target.value}`);
		setTimeRange(ev.target.value);
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getData();
			}
		},
		[ authToken, timeRange, getData ]
	);

	useEffect(() => {
		ReactGA.pageview('/user_stats');
	});

	const renderStats = () => {
		if (existsData) {
			return (
				<div id="stats">
					<StatCard
						barStat={true}
						title="Acousticness"
						percentage={stats.acousticness}
						explanation="acoustExplanation"
						color="seagreen"
					/>
					<StatCard
						barStat={true}
						title="Danceability"
						percentage={stats.danceability}
						explanation="danceExplanation"
						color="violet"
					/>
					<StatCard
						barStat={true}
						title="Energy"
						percentage={stats.energy}
						explanation="energyExplanation"
						color="orangered"
					/>
					<StatCard
						barStat={true}
						title="Instrumentalness"
						percentage={stats.instrumentalness}
						explanation="instrumExplanation"
						color="limegreen"
					/>
					<StatCard
						barStat={true}
						title="Liveness"
						percentage={stats.liveness}
						explanation="liveExplanation"
						color="deepskyblue"
					/>
					<StatCard
						barStat={true}
						title="Valence"
						percentage={stats.valence}
						explanation="valExplanation"
						color="orange"
					/>
					<div id="mobile-separator" />
				</div>
			);
		}

		return (
			<NoContent
				mainText="You haven't listened to enough music to gather information..."
				secondaryText="Go enjoy some beats and come back, we'll wait 😊"
			/>
		);
	};

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Your Statistics - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && (
						<React.Fragment>
							<Textfit className="title" mode="single" max={35}>
								· Your Statistics ·
							</Textfit>
							{existsData && (
								<div id="misc-info">
									<StatCard
										barStat={false}
										title="Average song duration"
										value={formatDuration(stats.duration_ms)}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Average loudness"
										value={Math.round(stats.loudness)}
										units="dB"
									/>
									<StatCard
										barStat={false}
										title="Average tempo"
										value={Math.round(stats.tempo)}
										units="bpm"
									/>
									<StatCard
										barStat={false}
										title="Average Popularity"
										value={Math.round(stats.popularity)}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Most Listened Genres"
										value={topGenres.map((genre, index) => {
											return (
												genre.charAt(0).toUpperCase() +
												genre.slice(1) +
												(index === topGenres.length - 1 ? '' : ', ')
											);
										})}
										units=""
									/>
								</div>
							)}
							{renderStats()}
						</React.Fragment>
					)}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Settings</Tab>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<div className="settings">
								<form>
									<p> Select a time range: </p>
									<div className="time-labels">
										<RadioInput
											id="short_term"
											value="short_term"
											name="time_range"
											checked={timeRange.localeCompare('short_term') === 0}
											onChange={updateTimeRange}
											title="Short Term"
										/>
										<RadioInput
											id="medium_term"
											value="medium_term"
											name="time_range"
											checked={timeRange.localeCompare('medium_term') === 0}
											onChange={updateTimeRange}
											title="Medium Term"
										/>
										<RadioInput
											id="long_term"
											value="long_term"
											name="time_range"
											checked={timeRange.localeCompare('long_term') === 0}
											onChange={updateTimeRange}
											title="Long Term"
										/>
									</div>
								</form>
							</div>
						</TabPanel>
						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="statistics" />
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

export default UserStats;
