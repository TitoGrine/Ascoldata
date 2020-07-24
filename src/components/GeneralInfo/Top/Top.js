import React, { useState, useEffect } from 'react';
import './Top.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import HeaderBar from '../../HeaderBar';
import ArtistTable from './ArtistTable';
import TrackTable from './TrackTable';
import Redirects from '../../Redirects';

const spotifyWebApi = new Spotify();

function Top() {
	const [ topType, setTopType ] = useState('track');
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

							if (err.status === 401) refreshToken();
						}
					);
				break;

			case 'track':
				spotifyWebApi
					.getMyTopTracks({
						limit: 10,
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

							if (err.status === 401) refreshToken();
						}
					);
				break;
			default:
				break;
		}
	};

	const renderTable = () => {
		if (topResults.length === 0) return;

		switch (topType) {
			case 'artist':
				return <ArtistTable topResults={topResults} />;
			case 'track':
				return <TrackTable topResults={topResults} />;
			default:
				return;
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
			}
		},
		[ timeRange, topType ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">{renderTable()}</section>
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
											setTopResults([]);
											setTopType(ev.target.value);
										}}
									>
										<p> View top: </p>
										<div className="time-labels">
											<label>
												<input
													id="track"
													type="radio"
													name="radios"
													value="track"
													defaultChecked
												/>
												<span className="checkmark" />
												Tracks
											</label>
											<label>
												<input id="artist" type="radio" name="radios" value="artist" />
												<span className="checkmark" />
												Artists
											</label>
										</div>
									</form>
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
								<Redirects exclude='top' />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Top;
