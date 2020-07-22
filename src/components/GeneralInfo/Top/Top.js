import React, { useState, useEffect } from 'react';
import './Top.css';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import HeaderBar from '../../HeaderBar';
import ArtistTable from './ArtistTable';

const spotifyWebApi = new Spotify();

function Top() {
	const [ madeCall, setMadeCall ] = useState(false);
	const [ topType, setTopType ] = useState('artist');
	const [ topResults, setTopResults ] = useState([]);
	const [ timeRange, setTimeRange ] = useState('short_term');
	const [ offset, setOffset ] = useState(0);

	const authToken = sessionStorage.getItem('authToken');

	const refreshToken = () => {
		const headers = {
			refresh_token: sessionStorage.getItem('refreshToken')
		};

		axios.get('http://localhost:8000/refresh_token', { params: headers }).then((response) => {
			console.log(response.data);

			sessionStorage.setItem('authToken', response.data.access_token);

			window.location.reload();
		});
	};

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		switch (topType) {
			case 'artist':
				spotifyWebApi
					.getMyTopArtists({
						limit: 12,
						offset: offset,
						time_range: timeRange
					})
					.then(
						function(data) {
							console.log(data.items);
							setTopResults(data.items);
						},
						function(err) {
							console.log(err);

							if (err.status == 400) refreshToken();
						}
					);
				break;

			case 'track':
				spotifyWebApi
					.getMyTopTracks({
						limit: 12,
						offset: offset,
						time_range: timeRange
					})
					.then(
						function(data) {
							console.log(data.items);
							setTopResults(data.items);
						},
						function(err) {
							console.log(err);

							if (err.status == 400) refreshToken();
						}
					);
				break;
			default:
				break;
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
			}
		},
		[ timeRange ]
	);

	useEffect(() => {
		if (madeCall) return;

		setMadeCall(true);

		if (authToken) {
			getData();
		}
	});

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<ArtistTable topResults={ topResults } />
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
											setTimeRange(ev.target.value);
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
												<input
													id="medium_term"
													type="radio"
													name="radios"
													value="medium_term"
												/>
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
		</React.Fragment>
	);
}

export default Top;
