import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import Pagination from 'react-js-pagination';
import { useMediaQuery } from 'react-responsive';

import { refreshToken } from '../../Auth/Auth';

import HeaderBar from '../../HeaderBar';
import ArtistTable from '../Artist/ArtistTable';
import TrackTable from '../Track/TrackTable';
import Redirects from '../../Redirects';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import TrackCards from '../Track/TrackCards';
import ArtistCards from '../Artist/ArtistCards';

const spotifyWebApi = new Spotify();

function Top() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ topType, setTopType ] = useState(query.get('type'));
	const [ topResults, setTopResults ] = useState([]);
	const [ timeRange, setTimeRange ] = useState(query.get('time_range'));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = async () => {
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
				return colapseTable ? <ArtistCards results={topResults} /> : <ArtistTable results={topResults} />;
			case 'track':
				return colapseTable ? <TrackCards results={topResults} /> : <TrackTable results={topResults} />;
			default:
				return;
		}
	};

	const updateTopType = (ev) => {
		setTopResults([]);
		setOffset(0);
		history.push(`/top?type=${ev.target.value}&time_range=${timeRange}&page=${page}`);
		setTopType(ev.target.value);
	};

	const updateTimeRange = (ev) => {
		setTopResults([]);
		setOffset(0);
		history.push(`/top?type=${topType}&time_range=${ev.target.value}&page=${page}`);
		setTimeRange(ev.target.value);
	};

	const switchPage = (ev) => {
		if (Number.isInteger(ev)) {
			setOffset(limit * (ev - 1));
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
				setPage(1 + offset / limit);
			}
		},
		[ authToken, timeRange, topType, offset ]
	);

	useEffect(
		() => {
			history.push(`/top?type=${topType}&time_range=${timeRange}&page=${page}`);
		},
		[ page ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum" className="top-content">
				<section className="content-section content-section-top slide-in-left">
					{renderTable()}
					<div className="pagination-divider" />
					<Pagination
						activePage={page}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={decreasePagination ? 3 : 8}
						onChange={switchPage}
					/>
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Settings</Tab>
							<Tab>Search</Tab>
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
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="top" />
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

export default Top;
