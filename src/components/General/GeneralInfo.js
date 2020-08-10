import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Textfit } from 'react-textfit';
import { FaSpotify } from 'react-icons/fa';

import { refreshToken } from '../Auth/Auth';
import { getCountryFromISOCode } from '../HelperFunc';

import Redirects from '../Redirects';
import Search from './Search/Search';
import SideToggle from '../SideToggle';
import HeaderBar from '../HeaderBar';
import LoadingSpinner from '../LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function GeneralInfo() {
	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
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

	const { promiseInProgress } = usePromiseTracker();

	const calcUserStats = (results, avgPopularity) => {
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
					valence: 0,
					popularity: avgPopularity
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

				localStorage.setItem('userStats', JSON.stringify(avgStats));

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

					let avgPopularity =
						data.items.reduce((total, track) => {
							return total + track.popularity;
						}, 0) / data.items.length;

					calcUserStats(tracks, avgPopularity);

					localStorage.setItem('track_seeds', tracks.slice(0, 5));
				},
				function(err) {
					console.log(err);
				}
			);
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);

				if (!calcStats) getUserStats();

				trackPromise(
					spotifyWebApi.getMe().then(
						function(data) {
							//console.log(data);

							setUser(data.display_name);
							setImage(data.images.length === 0 ? '' : data.images[0].url);
							setId(data.id);
							setEmail(data.email);
							setCountry(getCountryFromISOCode(data.country));
							setFollowers(data.followers.total);
							setProduct(data.product);
							setLink(data.external_urls.spotify);
							setURI(data.uri);

							localStorage.setItem('country', data.country);
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
				);
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>Ascoldata</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && (
						<div id="profile-info">
							<Textfit className="username" mode="single" max={36}>
								· Hello<strong> {user} </strong> ·
							</Textfit>
							<a href={link} target="_blank">
								<FaSpotify className="title-icon-link heartbeat" />
							</a>
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
										<strong>Spotify URI:</strong> {uri}
									</li>
								</ul>
							</div>
						</div>
					)}
					<div id="mobile-separator" />
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
							<Redirects exclude="home" />
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

export default GeneralInfo;
