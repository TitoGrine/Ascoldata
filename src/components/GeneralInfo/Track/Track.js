import React, { useState, useEffect } from 'react';
import './Track.css';
import Spotify from 'spotify-web-api-js';
import { useLocation } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { refreshToken } from '../../Auth/TokenFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const track = query.get('id');

	const [ authToken, setAuthToken ] = useState(sessionStorage.getItem('authToken'));
	const [ trackName, setTrackName ] = useState('');
	const [ trackAlbum, setTrackAlbum ] = useState('');
	const [ trackArtists, setTrackArtists ] = useState('');
	const [ trackDuration, setTrackDuration ] = useState('');
	const [ trackPopularity, setTrackPopularity ] = useState('');

	const [ trackStats, setTrackStats ] = useState({});

	const formatDuration = (duration_ms) => {
		let seconds = Math.round(duration_ms / 1000);
		let minutes = Math.floor(seconds / 60);

		return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
	};

	const getTrackMetaData = async () => {
		spotifyWebApi.getTrack(track).then(
			function(data) {
				setTrackName(data.name);
				setTrackAlbum(data.album.name);
				setTrackArtists(data.artists);
				setTrackDuration(data.duration_ms);
				setTrackPopularity(data.popularity);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getTrackFeatures = async () => {
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

				if (err.status === 401) refreshToken();
			}
		);
	};

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

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<Textfit className="track-title" mode="single" max={36}>· {trackName} ·</Textfit>
					<div id="track-info">
						<StatCard barStat={false} title="Album" value={trackAlbum} units="" />
						<StatCard
							barStat={false}
							title="Artist"
							value={trackArtists === '' ? '' : trackArtists[0].name}
							units=""
						/>
						<StatCard barStat={false} title="Duration" value={formatDuration(trackDuration)} units="" />
						<StatCard barStat={false} title="Key" value={keyBinds[trackStats.pitchKey + 1]} units="" />
						<StatCard barStat={false} title="Popularity" value={trackPopularity} units="" />
					</div>
					<div id="track-stats">
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
					</div>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<Tabs>
							<TabList>
								<Tab>Go to</Tab>
							</TabList>

							<TabPanel>
								<Redirects exclude="" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

const keyBinds = ['Unknown', 'C', 'C♯, D♭', 'D', 'D♯, E♭', 'E', 'F', 'F♯, G♭', 'G','G♯, A♭', 'A', 'A♯, B♭', 'B']

export default Track;
