import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import './SelectInputs.css';
import './Pagination.css';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';

import { refreshToken } from '../Auth/TokenFunc';

import Redirects from '../Redirects';
import { Textfit } from 'react-textfit';
import Search from './Search/Search';

const spotifyWebApi = new Spotify();

function GeneralInfo() {
	const [ authToken, setAuthToken ] = useState(sessionStorage.getItem('authToken'));
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
					valence: 0
				};

				data.audio_features.forEach((track_info) => {
					avgStats.acousticness += 2 * track_info.acousticness;
					avgStats.danceability += 2 * track_info.danceability;
					avgStats.duration_ms += track_info.duration_ms / 50;
					avgStats.energy += 2 * track_info.energy;
					avgStats.instrumentalness += 2 * track_info.instrumentalness;
					avgStats.liveness += 2 * track_info.liveness;
					avgStats.loudness += track_info.loudness / 50;
					avgStats.mode += track_info.mode;
					avgStats.speechiness += 2 * track_info.speechiness;
					avgStats.tempo += track_info.tempo / 50;
					avgStats.valence += 2 * track_info.valence;
				});

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
				time_range: 'short_term'
			})
			.then(
				function(data) {
					let tracks = data.items.map((track) => {
						return track.id;
					});

					calcUserStats(tracks);

					sessionStorage.setItem('track_seeds', tracks.slice(0, 5));
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();

					return;
				}
			);
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);

				if (!calcStats) getUserStats();

				spotifyWebApi.getMe().then(
					function(data) {
						//console.log(data);

						setUser(data.display_name);
						setImage(data.images.length === 0 ? '' : data.images[0].url);
						setId(data.id);
						setEmail(data.email);
						setCountry(data.country);
						setFollowers(data.followers.total);
						setProduct(data.product);
						setLink(data.external_urls.spotify);
						setURI(data.uri);

						sessionStorage.setItem('country', data.country);
						sessionStorage.setItem('profile-picture', data.images.length === 0 ? '' : data.images[0].url);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken();
					}
				);
			}
		},
		[ authToken ]
	);

	return (
		<div id="corporum">
			<section className="content-section slide-in-left">
				<div id="profile-info">
					<Textfit className="username" mode="single" max={36}>
						· Hello<strong> {user} </strong> ·
					</Textfit>
					<div id="info">
						<div id="image">
							<Image src={image} thumbnail />
						</div>
						<ul id="user-info">
							<li>
								<strong>ID:</strong> {id}
							</li>
							<li>
								<strong>Email:</strong> {email}
							</li>
							<li>
								<strong>Country:</strong> {country}
							</li>
							<li>
								<strong>Subscription:</strong> {product}
							</li>
							<li>
								<strong>No. followers:</strong> {followers}
							</li>
							<li>
								<strong>Spotify link:</strong> <a href={link}>{link}</a>
							</li>
							<li>
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
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="user" />
						</TabPanel>
					</Tabs>
				</div>
			</section>
		</div>
	);
}

export default GeneralInfo;
