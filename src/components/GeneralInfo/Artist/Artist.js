import React, { useState, useEffect } from 'react';
import './Artist.css';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';

const spotifyWebApi = new Spotify();

function Artist() {
	const query = new URLSearchParams(useLocation().search);

	const [ authToken, setAuthToken ] = useState(sessionStorage.getItem('authToken'));
	const [ artist, setArtist ] = useState(query.get('id'));
	const [ artistStats, setArtistStats ] = useState({});

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

	const getArtistMetaData = async (info) => {
		spotifyWebApi.getArtist(artist).then(
			function(data) {
				info.name = data.name;
				info.image = data.images.length === 0 ? '' : data.images[0].url;
				info.followers = data.followers.total;
				info.genres = data.genres;
				info.popularity = data.popularity;
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getArtistTopTracks = async (info) => {
		spotifyWebApi.getArtistTopTracks(artist, sessionStorage.getItem('country')).then(
			function(data) {
				info.tracks = data.tracks.map((track) => {
					return track.id;
				});

				getArtistStats(info);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getArtistStats = async (info) => {
		spotifyWebApi.getAudioFeaturesForTracks(info.tracks).then(
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
					avgStats.acousticness += 10 * track_info.acousticness;
					avgStats.danceability += 10 * track_info.danceability;
					avgStats.duration_ms += track_info.duration_ms / 10;
					avgStats.energy += 10 * track_info.energy;
					avgStats.instrumentalness += 10 * track_info.instrumentalness;
					avgStats.liveness += 10 * track_info.liveness;
					avgStats.loudness += track_info.loudness / 10;
					avgStats.mode += track_info.mode;
					avgStats.speechiness += 10 * track_info.speechiness;
					avgStats.tempo += track_info.tempo / 10;
					avgStats.valence += 10 * track_info.valence;
				});

				info.stats = avgStats;

				setArtistStats(info);
				console.log(info);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken();
			}
		);
	};

	const getData = async () => {
		const info = {};

		getArtistMetaData(info).then(function(data) {
			getArtistTopTracks(info);
		});
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
					<h2> · {artistStats.name} · </h2>
					<div id="artist-info">
						<div id="image">
							<Image src={artistStats.image} thumbnail />
						</div>
						<div className="info-cards">
							Followers
							<strong>{artistStats.followers}</strong>
						</div>
						<div className="info-cards">
							Genre
							<strong>{typeof artistStats.genres === 'undefined' ? '' : artistStats.genres[0]}</strong>
						</div>
						<div className="info-cards">
							Popularity
							<strong>{artistStats.popularity}</strong>
						</div>
					</div>
					{typeof artistStats.stats !== 'undefined' && (
						<div id="artist-stats">
							<StatCard
								barStat={true}
								title="Acousticness"
								percentage={artistStats.stats.acousticness}
								explanation="acoustExplanation"
								color="seagreen"
							/>
							<StatCard
								barStat={true}
								title="Danceability"
								percentage={artistStats.stats.danceability}
								explanation="danceExplanation"
								color="violet"
							/>
							<StatCard
								barStat={true}
								title="Energy"
								percentage={artistStats.stats.energy}
								explanation="energyExplanation"
								color="orangered"
							/>
							<StatCard
								barStat={true}
								title="Instrumentalness"
								percentage={artistStats.stats.instrumentalness}
								explanation="instrumExplanation"
								color="limegreen"
							/>
							<StatCard
								barStat={true}
								title="Liveness"
								percentage={artistStats.stats.liveness}
								explanation="liveExplanation"
								color="deepskyblue"
							/>
							<StatCard
								barStat={true}
								title="Valence"
								percentage={artistStats.stats.valence}
								explanation="valExplanation"
								color="orange"
							/>
						</div>
					)}
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

export default Artist;
