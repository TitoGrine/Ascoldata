import React, { useState, useEffect } from 'react';
import './Top.css';
import '../Pagination.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import Pagination from 'react-js-pagination';

import { refreshToken } from '../../Auth/TokenFunc';

import HeaderBar from '../../HeaderBar';
import ArtistTable from './ArtistTable';
import TrackTable from './TrackTable';
import Redirects from '../../Redirects';

const spotifyWebApi = new Spotify();

function Top() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 10;

	const [ topType, setTopType ] = useState(query.get('type'));
	const [ topResults, setTopResults ] = useState([]);
	const [ timeRange, setTimeRange ] = useState(query.get('time_range'));
	const [ offset, setOffset ] = useState(0);
	const [ totalItems, setTotalItems ] = useState(0);

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		switch (topType) {
			case 'artist':
				spotifyWebApi
					.getMyTopArtists({
						limit: limit,
						offset: offset,
						time_range: timeRange
					})
					.then(
						function(data) {
							setTotalItems(data.total);
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
						limit: limit,
						offset: offset,
						time_range: timeRange
					})
					.then(
						function(data) {
							setTotalItems(data.total);
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

	const updateTopType = (ev) => {
		setTopResults([]);
		setOffset(0);
		history.push('/top?type=' + ev.target.value + '&time_range=' + timeRange);
		setTopType(ev.target.value);
	};

	const updateTimeRange = (ev) => {
		setTopResults([]);
		setOffset(0);
		history.push('/top?type=' + topType + '&time_range=' + ev.target.value);
		setTimeRange(ev.target.value);
	};

	const switchPage = (ev) => {
		if(Number.isInteger(ev))
			setOffset(10 * (ev - 1));
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
			}
		},
		[ authToken, timeRange, topType, offset ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum" className="top-content">
				<section className="content-section content-section-top slide-in-left">
					{renderTable()}
					<div className="pagination-divider"></div>
					<Pagination
						activePage={offset / 10 + 1}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={5}
						onChange={switchPage}
					/>
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
									<form>
										<p> View top: </p>
										<div className="type-labels">
											<label>
												<input
													id="track"
													type="radio"
													name="radios"
													value="track"
													checked={topType.localeCompare('track') === 0}
													onChange={updateTopType}
												/>
												<span className="checkmark" />
												Tracks
											</label>
											<label>
												<input
													id="artist"
													type="radio"
													name="radios"
													value="artist"
													checked={topType.localeCompare('artist') === 0}
													onChange={updateTopType}
												/>
												<span className="checkmark" />
												Artists
											</label>
										</div>
									</form>
									<form>
										<p> Select a time range: </p>
										<div className="time-labels">
											<label>
												<input
													id="short_term"
													type="radio"
													name="radios"
													value="short_term"
													checked={timeRange.localeCompare('short_term') === 0}
													onChange={updateTimeRange}
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
													checked={timeRange.localeCompare('medium_term') === 0}
													onChange={updateTimeRange}
												/>
												<span className="checkmark" />
												Medium Term
											</label>
											<label>
												<input
													id="long_term"
													type="radio"
													name="radios"
													value="long_term"
													checked={timeRange.localeCompare('long_term') === 0}
													onChange={updateTimeRange}
												/>
												<span className="checkmark" />
												Long Term
											</label>
										</div>
									</form>
								</div>
							</TabPanel>
							<TabPanel>
								<Redirects exclude="top" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Top;
