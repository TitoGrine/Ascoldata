import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { formatDuration, decodeString } from '../Util/HelperFunc';
import default_art from '../../assets/images/default_art.png';

import Redirects from '../Common/Redirects';
import StatCard from '../Stats/StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import { FaSpotify } from 'react-icons/fa';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';
import Owner from '../User/Creator';

const spotifyWebApi = new Spotify();

function Playlist() {
	const query = new URLSearchParams(useLocation().search);
	const playlist = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ existsData, setExistsData ] = useState(false);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ playlistName, setPlaylistName ] = useState('');
	const [ playlistLink, setPlaylistLink ] = useState('');
	const [ playlistUri, setPlaylistUri ] = useState('');
	const [ playlistImage, setPlaylistImage ] = useState(default_art);
	const [ playlistDescription, setPlaylistDescription ] = useState('');
	const [ playlistFollowers, setPlaylistFollowers ] = useState('');
	const [ playlistOwner, setPlaylistOwner ] = useState('');
	const [ playlistOwnerData, setPlaylistOwnerData ] = useState('');
	const [ playlistNoTracks, setPlaylistNoTracks ] = useState('');
	const [ playlistDuration, setPlaylistDuration ] = useState('');

	const [ playlistStats, setPlaylistStats ] = useState({});

	const { promiseInProgress } = usePromiseTracker();

	const getPlaylistTracksInfo = async (total_tracks, tracks) => {
		if (total_tracks === tracks.length) {
			getPlaylistStats(
				total_tracks,
				tracks.map((track) => {
					return track.track.id;
				}),
				[]
			);

			return;
		}

		spotifyWebApi
			.getPlaylistTracks(playlist, {
				limit: 100,
				offset: tracks.length
			})
			.then(
				function(data) {
					getPlaylistTracksInfo(total_tracks, [ ...tracks, ...data.items ]);
				},
				function(err) {
					console.log(err);
				}
			);
	};

	const getPlaylistMetaData = async () => {
		trackPromise(
			spotifyWebApi.getPlaylist(playlist).then(
				function(data) {
					setPlaylistName(data.name);
					setPlaylistLink(data.external_urls.spotify);
					setPlaylistUri(data.uri);
					if (data.images.length > 0) setPlaylistImage(data.images[0].url);
					setPlaylistDescription(decodeString(data.description));
					setPlaylistFollowers(data.followers.total);
					setPlaylistOwner(data.owner);
					setPlaylistNoTracks(data.tracks.total);

					if (data.tracks.items.length > 0) {
						getPlaylistTracksInfo(data.tracks.total, data.tracks.items);
						setExistsData(true);
					}

					if (data.owner.id) getOwnerInfo(data.owner.id);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getOwnerInfo = (owner) => {
		spotifyWebApi.getUser(owner).then(
			function(data) {
				// console.log(data);
				setPlaylistOwnerData(data);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
		);
	};

	const getPlaylistStats = async (total_tracks, tracks, audio_features) => {
		if (total_tracks === audio_features.length) {
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
				valence: 0
			};

			audio_features.forEach((track_info) => {
				avgStats.acousticness += 100 * track_info.acousticness / total_tracks;
				avgStats.danceability += 100 * track_info.danceability / total_tracks;
				avgStats.duration_ms += track_info.duration_ms;
				avgStats.energy += 100 * track_info.energy / total_tracks;
				avgStats.instrumentalness += 100 * track_info.instrumentalness / total_tracks;
				avgStats.liveness += 100 * track_info.liveness / total_tracks;
				avgStats.loudness += track_info.loudness / total_tracks;
				avgStats.mode += track_info.mode;
				avgStats.speechiness += 100 * track_info.speechiness / total_tracks;
				avgStats.tempo += track_info.tempo / total_tracks;
				avgStats.valence += 100 * track_info.valence / total_tracks;
			});

			setPlaylistDuration(avgStats.duration_ms);
			setPlaylistStats(avgStats);

			return;
		}

		trackPromise(
			spotifyWebApi
				.getAudioFeaturesForTracks(tracks.slice(audio_features.length, audio_features.length + 100))
				.then(
					function(data) {
						getPlaylistStats(total_tracks, tracks, [ ...audio_features, ...data.audio_features ]);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
		);
	};

	const getData = async () => {
		getPlaylistMetaData();
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

	useEffect(() => {
		ReactGA.pageview('/playlist');
	});

	const renderStats = () => {
		if (existsData) {
			return (
				<div id="stats">
					<StatCard
						barStat={true}
						title="Acousticness"
						percentage={playlistStats.acousticness}
						explanation="acoustExplanation"
						color="seagreen"
					/>
					<StatCard
						barStat={true}
						title="Danceability"
						percentage={playlistStats.danceability}
						explanation="danceExplanation"
						color="violet"
					/>
					<StatCard
						barStat={true}
						title="Energy"
						percentage={playlistStats.energy}
						explanation="energyExplanation"
						color="orangered"
					/>
					<StatCard
						barStat={true}
						title="Instrumentalness"
						percentage={playlistStats.instrumentalness}
						explanation="instrumExplanation"
						color="limegreen"
					/>
					<StatCard
						barStat={true}
						title="Liveness"
						percentage={playlistStats.liveness}
						explanation="liveExplanation"
						color="deepskyblue"
					/>
					<StatCard
						barStat={true}
						title="Valence"
						percentage={playlistStats.valence}
						explanation="valExplanation"
						color="orange"
					/>
					<div id="mobile-separator" />
				</div>
			);
		}

		return <NoContent mainText="Playlist doesn't have enough songs for analysis..." />;
	};

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${playlistName.length === 0 ? 'Playlist' : playlistName} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && (
						<React.Fragment>
							<Textfit className="playlist-title" mode="single" max={36}>
								· {playlistName} ·
							</Textfit>
							<a href={playlistLink} target="_blank" className="icon-link spotify-icon-link heartbeat">
								<FaSpotify />
							</a>

							<div id="playlist-info">
								<div id="image">
									<Image src={playlistImage} thumbnail />
								</div>
								<div id="misc-data">
									<StatCard
										barStat={false}
										title="Creator"
										value={playlistOwner.display_name}
										units=""
									/>
									<StatCard barStat={false} title="Followers" value={playlistFollowers} units="" />
									<StatCard
										barStat={false}
										title="Duration"
										value={formatDuration(playlistDuration)}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Nr. Songs"
										value={
											<Link
												to={`/playlist_tracks?id=${playlist}&page=${1}`}
												style={{ color: 'var(--color-primary)' }}
											>
												{playlistNoTracks}
											</Link>
										}
										units=""
									/>
									{playlistDescription.length > 0 && (
										<Textfit id="playlist-description" mode="multi" max={20}>
											<div className="divider" />
											{playlistDescription}
										</Textfit>
									)}
								</div>
							</div>
							{renderStats()}
						</React.Fragment>
					)}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Preview</Tab>
							<Tab>Creator</Tab>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel className="preview_tab">
							<LoadingSpinner />
							{!promiseInProgress && (
								<iframe
									src={`https://embed.spotify.com/?uri=${playlistUri}&view=list&theme=black`}
									width="100%"
									height="90%"
									frameBorder="0"
									allowtransparency="true"
									allow="encrypted-media"
								/>
							)}
						</TabPanel>
						<TabPanel>
							<Owner info={playlistOwnerData} />
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

export default Playlist;
