import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import Redirects from '../Redirects';

const spotifyWebApi = new Spotify();

function GeneralInfo() {
	const [ user, setUser ] = useState('');
	const [ id, setId ] = useState('');
	const [ image, setImage ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ country, setCountry ] = useState('');
	const [ followers, setFollowers ] = useState('');
	const [ product, setProduct ] = useState('');
	const [ link, setLink ] = useState('');
	const [ uri, setURI ] = useState('');
	const [ calcStats, setCalcStats ] = useState(false);

	const calcUserStats = (results) => {
		spotifyWebApi.getAudioFeaturesForTracks(results).then(
			function(data) {
				console.log(data.audio_features);

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
				}

				data.audio_features.forEach((track_info) => {
					avgStats.acousticness += 2 * track_info.acousticness ;
					avgStats.danceability += 2 * track_info.danceability ;
					avgStats.duration_ms += 2 * track_info.duration_ms ;
					avgStats.energy += 2 * track_info.energy ;
					avgStats.instrumentalness += 2 * track_info.instrumentalness ;
					avgStats.liveness += 2 * track_info.liveness ;
					avgStats.loudness += 2 * track_info.loudness ;
					avgStats.mode += track_info.mode;
					avgStats.speechiness += 2 * track_info.speechiness ;
					avgStats.tempo += 2 * track_info.tempo ;
					avgStats.valence += 2 * track_info.valence ;
				})

				setCalcStats(true);

				sessionStorage.setItem('userStats', JSON.stringify(avgStats));

				//console.log(avgStats);
			},
			function(err) {
				console.log(err);
			}
		);
	};

	const getUserStats = () => {
		spotifyWebApi
			.getMyTopTracks({
				limit: 50,
				offset: 0,
				time_range: 'long_term'
			})
			.then(
				function(data) {
					calcUserStats(
						data.items.map((track) => {
							return track.id;
						})
					);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();

					return;
				}
			);
	};

	const refreshToken = async () => {
		const headers = {
			refresh_token: sessionStorage.getItem('refreshToken')
		};

		axios.get('http://localhost:8000/refresh_token', { params: headers }).then((response) => {
			console.log(response.data);

			sessionStorage.setItem('authToken', response.data.access_token);

			window.location.reload();
		});
	};

	useEffect(() => {
		const authToken = sessionStorage.getItem('authToken');

		if (authToken && user === '') {
			spotifyWebApi.setAccessToken(authToken);

			if(!calcStats)
				getUserStats();

			spotifyWebApi.getMe().then(
				function(data) {
					//console.log(data);

					setUser(data.display_name);
					setImage(data.images[0].url);
					setId(data.id);
					setEmail(data.email);
					setCountry(data.country);
					setFollowers(data.followers.total);
					setProduct(data.product);
					setLink(data.external_urls.spotify);
					setURI(data.uri);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();
				}
			);
		}
	});

	return (
		<div id="corporum">
			<section className="content-section slide-in-left">
				<div id="profile-info">
					<h2>
						{' '}
						· Hello <strong>{user}</strong> ·
					</h2>
					<div id="info">
						<div id="image">
							<Image src={image} thumbnail />
						</div>
						<ul>
							<li>
								{' '}
								<strong>ID:</strong> {id}
							</li>
							<li>
								{' '}
								<strong>Email:</strong> {email}
							</li>
							<li>
								{' '}
								<strong>Country:</strong> {country}
							</li>
							<li>
								{' '}
								<strong>Subscription:</strong> {product}
							</li>
							<li>
								{' '}
								<strong>No. followers:</strong> {followers}
							</li>
							<li>
								{' '}
								<strong>Spotify link:</strong> <a href={link}>{link}</a>
							</li>
							<li>
								{' '}
								<strong>Spotify URI:</strong> {uri}
							</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="sidebar-section slide-in-right">
				<div className="side-content">
					<Tabs>
						<TabList>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Redirects exclude='user' />
						</TabPanel>
					</Tabs>
				</div>
			</section>
		</div>
	);
}

export default GeneralInfo;
