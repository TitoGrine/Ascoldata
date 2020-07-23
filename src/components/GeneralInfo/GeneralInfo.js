import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

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
	const [ calcStats, setCalcStats ] = useState(true);

	const calcUserStats = (results) => {
		spotifyWebApi.getAudioFeaturesForTracks(results).then(
			function(data) {
				console.log(data);
			},
			function(err) {
				console.log(err);
			}
		);
		console.log(results);
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
					setCalcStats(false);

					if (err.status == 401) refreshToken();

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

			getUserStats();

			spotifyWebApi.getMe().then(
				function(data) {
					console.log(data);

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

					if (err.status == 401) refreshToken();
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
							<Tab>Settings</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<div className="settings">
								<form
									onChange={(ev) => {
										console.log(ev.target.value);
									}}
								>
									<p> Select a time range: </p>
									<div className="time-labels">
										<label>
											<input
												id="short_term"
												type="radio"
												name="radios"
												value="short_term"
												defaultChecked
											/>
											<span className="checkmark" />
											Short Term
										</label>
										<label>
											<input id="medium_term" type="radio" name="radios" value="medium_term" />
											<span className="checkmark" />
											Medium Term
										</label>
										<label>
											<input id="long_term" type="radio" name="radios" value="long_term" />
											<span className="checkmark" />
											Long Term
										</label>
									</div>
								</form>
							</div>
						</TabPanel>
						<TabPanel>
							<ul className="redirects">
								<li>
									{' '}
									<Link to="/top">Top</Link>{' '}
								</li>
								<li>
									{' '}
									<Link to="/">Playlists</Link>{' '}
								</li>
							</ul>
						</TabPanel>
					</Tabs>
				</div>
			</section>
		</div>
	);
}

export default GeneralInfo;
