import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../../Auth/Auth';
import { formatDuration } from '../../HelperFunc';

import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';
import { Image } from 'react-bootstrap';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import HeaderBar from '../../HeaderBar';
import LoadingSpinner from '../../LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const album = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ albumName, setAlbumName ] = useState('');
	const [ albumLink, setAlbumLink ] = useState('');
	const [ albumUri, setAlbumUri ] = useState('');
	const [ albumImage, setAlbumImage ] = useState('');
	const [ albumLabel, setAlbumLabel ] = useState('');
	const [ albumArtists, setAlbumArtists ] = useState('');
	const [ albumNrSongs, setAlbumNrSongs ] = useState('');
	const [ albumGenres, setAlbumGenres ] = useState('');
	const [ albumDuration, setAlbumDuration ] = useState('');
	const [ albumRelDate, setAlbumRelDate ] = useState('');
	const [ albumPopularity, setAlbumPopularity ] = useState('');

	const [ albumStats, setAlbumStats ] = useState({});

	const { promiseInProgress } = usePromiseTracker();

	const getAlbumMetaData = async () => {
		trackPromise(
			spotifyWebApi.getAlbum(album).then(
				function(data) {
					//console.log(data);

					setAlbumName(data.name);
					setAlbumLink(data.external_urls.spotify);
					setAlbumUri(data.uri);
					setAlbumImage(data.images.length === 0 ? '' : data.images[0].url);
					setAlbumLabel(data.label);
					setAlbumArtists(data.artists);
					setAlbumNrSongs(data.tracks.items.length);
					setAlbumGenres(data.genres);
					setAlbumRelDate(data.release_date);
					setAlbumPopularity(data.popularity);

					getAlbumFeatures(
						data.tracks.items.map((track) => {
							return track.id;
						})
					);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getAlbumFeatures = async (tracks) => {
		trackPromise(
			spotifyWebApi.getAudioFeaturesForTracks(tracks).then(
				function(data) {
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

					setAlbumDuration(avgStats.duration_ms);
					setAlbumStats(avgStats);
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
					title="Artist"
					value={albumArtists.map((artist) => {
						return (
							<Link key={artist.id} to={'/artist?id=' + artist.id} style={{ color: '#1db954' }}>
								{artist.name}
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
								· {albumName} ·
							</Textfit>
							<a href={albumLink} target="_blank">
								<FaSpotify className="title-icon-link heartbeat" />
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
									<StatCard barStat={false} title="Nr. Songs" value={albumNrSongs} units="" />
									<StatCard barStat={false} title="Popularity" value={albumPopularity} units="" />
								</div>
							</div>
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
