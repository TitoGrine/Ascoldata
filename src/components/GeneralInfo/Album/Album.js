import React, { useState, useEffect } from 'react';
import './Album.css';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const album = query.get('id');

	const [ authToken, setAuthToken ] = useState(sessionStorage.getItem('authToken'));
    const [ albumName, setAlbumName ] = useState('');
    const [ albumImage, setAlbumImage ] = useState('');
    const [ albumLabel, setAlbumLabel ] = useState('');
    const [ albumArtists, setAlbumArtists ] = useState('');
    const [ albumNrSongs, setAlbumNrSongs ] = useState('');
	const [ albumGenres, setAlbumGenres ] = useState('');
    const [ albumDuration, setAlbumDuration ] = useState('');
    const [ albumRelDate, setAlbumRelDate ] = useState('');
	const [ albumPopularity, setAlbumPopularity ] = useState('');

	const [ albumStats, setAlbumStats ] = useState({});

	const formatDuration = (duration_ms) => {
		let seconds = Math.round(duration_ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

		return hours === 0 ? ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2) : hours + 'h ' + ('00' + minutes % 60).slice(-2) + 'min';
	};

	const refreshToken = () => {
		const headers = {
			refresh_token: sessionStorage.getItem('refreshToken')
		};

		axios.get('http://localhost:8000/refresh_token', { params: headers }).then((response) => {
			console.log(response.data);

			sessionStorage.setItem('authToken', response.data.access_token);

			setAuthToken(response.data.access_token);
		});
	};

	const getAlbumMetaData = async () => {
		spotifyWebApi.getAlbum(album).then(
			function(data) {
                console.log(data);

                setAlbumName(data.name);
                setAlbumImage(data.images.length === 0 ? '' : data.images[0].url);
                setAlbumLabel(data.label);
                setAlbumArtists(data.artists);
                setAlbumNrSongs(data.tracks.items.length);
                setAlbumGenres(data.genres);
                setAlbumRelDate(data.release_date);
                setAlbumPopularity(data.popularity);

                getAlbumFeatures(data.tracks.items.map((track) => {return track.id;}))
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getAlbumFeatures = async (tracks) => {
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

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getData = async () => {
		getAlbumMetaData();
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
					<Textfit className="album-title" mode="single" max={40}>· {albumName} ·</Textfit>
					<div id="album-info">
						<StatCard
							barStat={false}
							title="Artist"
							value={albumArtists === '' ? '' : albumArtists[0].name}
							units=""
						/>
                        <StatCard barStat={false} title="Label" value={albumLabel} units="" />
                        <StatCard barStat={false} title="Release Date" value={albumRelDate} units="" />
						<StatCard barStat={false} title="Duration" value={formatDuration(albumDuration)} units="" />
                        <StatCard barStat={false} title="Nr. Songs" value={albumNrSongs} units="" />
                        <StatCard barStat={false} title="Popularity" value={albumPopularity} units="" />
					</div>
					<div id="album-stats">
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

export default Track;
