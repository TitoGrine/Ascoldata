import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { formatDuration } from '../Util/HelperFunc';
import default_art from '../../assets/images/default_art.png';

import Redirects from '../Common/Redirects';
import StatCard from '../Stats/StatCard';
import { Image } from 'react-bootstrap';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const album = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ existsData, setExistsData ] = useState(false);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ albumName, setAlbumName ] = useState('');
	const [ albumLink, setAlbumLink ] = useState('');
	const [ albumUri, setAlbumUri ] = useState('');
	const [ albumImage, setAlbumImage ] = useState(default_art);
	const [ albumLabel, setAlbumLabel ] = useState('');
	const [ albumArtists, setAlbumArtists ] = useState('');
	const [ albumNrSongs, setAlbumNrSongs ] = useState('');
	const [ albumDuration, setAlbumDuration ] = useState('');
	const [ albumRelDate, setAlbumRelDate ] = useState('');
	const [ albumPopularity, setAlbumPopularity ] = useState('');

	const [ albumStats, setAlbumStats ] = useState({});

	const { promiseInProgress } = usePromiseTracker();

	const getAlbumTracksInfo = async (total_tracks, tracks) => {
		if (total_tracks === tracks.length) {
			getAlbumFeatures(
				total_tracks,
				tracks.map((track) => {
					return track.id;
				}),
				[]
			);

			return;
		}

		spotifyWebApi
			.getAlbumTracks(album, {
				limit: 50,
				offset: tracks.length
			})
			.then(
				function(data) {
					getAlbumTracksInfo(total_tracks, [ ...tracks, ...data.items ]);
				},
				function(err) {
					console.log(err);
				}
			);
	};

	const getAlbumMetaData = async () => {
		trackPromise(
			spotifyWebApi.getAlbum(album).then(
				function(data) {
					//console.log(data);

					if (data.images.length > 0) setAlbumImage(data.images[0].url);

					setAlbumName(data.name);
					setAlbumLink(data.external_urls.spotify);
					setAlbumUri(data.uri);
					setAlbumLabel(data.label);
					setAlbumArtists(data.artists);
					setAlbumNrSongs(data.tracks.total);
					setAlbumRelDate(data.release_date);
					setAlbumPopularity(data.popularity);

					if (data.tracks.items.length > 0) {
						getAlbumTracksInfo(data.tracks.total, data.tracks.items);
						setExistsData(true);
					}
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getAlbumFeatures = async (total_tracks, tracks, audio_features) => {
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

			setAlbumDuration(avgStats.duration_ms);
			setAlbumStats(avgStats);

			return;
		}

		trackPromise(
			spotifyWebApi
				.getAudioFeaturesForTracks(tracks.slice(audio_features.length, audio_features.length + 100))
				.then(
					function(data) {
						getAlbumFeatures(total_tracks, tracks, [ ...audio_features, ...data.audio_features ]);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
		);
	};

	const getData = async () => {
		getAlbumMetaData();
	};

	const getArtist = () => {
		if (albumArtists !== '' && albumArtists.length > 0) {
			return (
				<StatCard
					barStat={false}
					title={`Artist${albumArtists.length > 1 ? 's' : ''}`}
					value={albumArtists.map((artist, index) => {
						return (
							<Link
								key={artist.id}
								to={`/artist?id=${artist.id}`}
								style={{ color: 'var(--color-primary)' }}
							>
								{`${artist.name}${index === albumArtists.length - 1 ? '' : ', '}`}
							</Link>
						);
					})}
					units=""
				/>
			);
		}
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
		ReactGA.pageview('/album');
	});

	const renderStats = () => {
		if (existsData) {
			return (
				<div id="stats">
					<StatCard
						barStat={true}
						title="Acousticness"
						percentage={albumStats.acousticness}
						explanation="acoustExplanation"
						color="seagreen"
					/>
					<StatCard
						barStat={true}
						title="Danceability"
						percentage={albumStats.danceability}
						explanation="danceExplanation"
						color="violet"
					/>
					<StatCard
						barStat={true}
						title="Energy"
						percentage={albumStats.energy}
						explanation="energyExplanation"
						color="orangered"
					/>
					<StatCard
						barStat={true}
						title="Instrumentalness"
						percentage={albumStats.instrumentalness}
						explanation="instrumExplanation"
						color="limegreen"
					/>
					<StatCard
						barStat={true}
						title="Liveness"
						percentage={albumStats.liveness}
						explanation="liveExplanation"
						color="deepskyblue"
					/>
					<StatCard
						barStat={true}
						title="Valence"
						percentage={albumStats.valence}
						explanation="valExplanation"
						color="orange"
					/>
					<div id="mobile-separator" />
				</div>
			);
		}

		return <NoContent mainText="Album doesn't have enough songs for analysis..." />;
	};

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${albumName.length === 0 ? 'Album' : albumName} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && (
						<React.Fragment>
							<Textfit className="album-title" mode="single" max={36}>
								· {albumName.length > 25 ? `${albumName.slice(0, 25)}...` : albumName} ·
							</Textfit>
							<a
								href={albumLink}
								target="_blank"
								rel="noopener noreferrer"
								className="icon-link spotify-icon-link heartbeat"
								onClick={() => {
									ReactGA.event({
										category: 'Interaction',
										action: 'Clicked on Spotify link for album.',
										label: 'Link Event'
									});
								}}
							>
								<FaSpotify />
							</a>
							<div id="album-info">
								<div id="image">
									<Image src={albumImage} thumbnail />
								</div>
								<div id="misc-data">
									{getArtist()}
									<StatCard barStat={false} title="Label" value={albumLabel} units="" />
									<StatCard barStat={false} title="Release Date" value={albumRelDate} units="" />
									<StatCard
										barStat={false}
										title="Duration"
										value={formatDuration(albumDuration)}
										units=""
									/>
									<StatCard
										barStat={false}
										title="Nr. Songs"
										value={
											<Link
												to={`/album_tracks?id=${album}&page=${1}`}
												style={{ color: 'var(--color-primary)' }}
											>
												{albumNrSongs}
											</Link>
										}
										units=""
									/>
									<StatCard barStat={false} title="Popularity" value={albumPopularity} units="" />
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
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel className="preview_tab">
							<LoadingSpinner />
							{!promiseInProgress && (
								<iframe
									src={`https://embed.spotify.com/?uri=${albumUri}&view=list&theme=black`}
									width="100%"
									height="90%"
									frameBorder="0"
									allowtransparency="true"
									title="album_preview"
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
