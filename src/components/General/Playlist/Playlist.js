import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { useLocation } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { refreshToken } from '../../Auth/Auth';
import { formatDuration, decodeString } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import { FaSpotify } from 'react-icons/fa';

const spotifyWebApi = new Spotify();

function Playlist() {
	const query = new URLSearchParams(useLocation().search);
	const playlist = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ playlistName, setPlaylistName ] = useState('');
	const [ playlistLink, setPlaylistLink ] = useState('');
	const [ playlistImage, setPlaylistImage ] = useState('');
	const [ playlistDescription, setPlaylistDescription ] = useState('');
	const [ playlistFollowers, setPlaylistFollowers ] = useState('');
	const [ playlistOwner, setPlaylistOwner ] = useState('');
	const [ playlistTracks, setPlaylistTracks ] = useState('');
	const [ playlistDuration, setPlaylistDuration ] = useState('');

	const [ playlistStats, setPlaylistStats ] = useState({});

	const getPlaylistMetaData = async () => {
		spotifyWebApi.getPlaylist(playlist).then(
			function(data) {
				setPlaylistName(data.name);
				setPlaylistLink(data.external_urls.spotify);
				setPlaylistImage(data.images.length === 0 ? '' : data.images[0].url);
				setPlaylistDescription(decodeString(data.description));
				setPlaylistFollowers(data.followers.total);
				setPlaylistOwner(data.owner);
				setPlaylistTracks(data.tracks.total);

				setPlaylistDuration(
					data.tracks.items.reduce((total, track) => {
						return total + track.track.duration_ms;
					}, 0)
				);

				getPlaylistStats(
					data.tracks.items.map((track) => {
						return track.track.id;
					})
				);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
		);
	};

	const getPlaylistStats = async (tracks) => {
		spotifyWebApi.getAudioFeaturesForTracks(tracks).then(
			function(data) {
				const avgStats = {
					acousticness: 0,
					danceability: 0,
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
					avgStats.energy += 100 * track_info.energy / data.audio_features.length;
					avgStats.instrumentalness += 100 * track_info.instrumentalness / data.audio_features.length;
					avgStats.liveness += 100 * track_info.liveness / data.audio_features.length;
					avgStats.loudness += track_info.loudness / data.audio_features.length;
					avgStats.mode += track_info.mode;
					avgStats.speechiness += 100 * track_info.speechiness / data.audio_features.length;
					avgStats.tempo += track_info.tempo / data.audio_features.length;
					avgStats.valence += 100 * track_info.valence / data.audio_features.length;
				});

				setPlaylistStats(avgStats);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
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

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<Textfit className="playlist-title" mode="single" max={36}>
						· {playlistName} ·
					</Textfit>
					<a href={playlistLink} target="_blank">
						<FaSpotify className="title-icon-link heartbeat" />
					</a>

					<div id="playlist-info">
						<div id="image">
							<Image src={playlistImage} thumbnail />
						</div>
						<div id="misc-data">
							<StatCard barStat={false} title="Creator" value={playlistOwner.display_name} units="" />
							<StatCard barStat={false} title="Followers" value={playlistFollowers} units="" />
							<StatCard
								barStat={false}
								title="Duration"
								value={formatDuration(playlistDuration)}
								units=""
							/>
							<StatCard barStat={false} title="Nr. Songs" value={playlistTracks} units="" />
							<Textfit id="playlist-description" mode="multi" max={20}>
								<div className="divider" />
								{playlistDescription}
							</Textfit>
						</div>
					</div>
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

export default Playlist;
