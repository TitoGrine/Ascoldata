import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import Pagination from 'react-js-pagination';
import { useMediaQuery } from 'react-responsive';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';

import ArtistTable from '../Artist/ArtistTable';
import TrackTable from '../Track/TrackTable';
import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import TrackCards from '../Track/TrackCards';
import ArtistCards from '../Artist/ArtistCards';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import RadioInput from '../Common/RadioInput';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function Top() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
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
				trackPromise(
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

								if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
							}
						)
				);
				break;

			case 'track':
				trackPromise(
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

								if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
							}
						)
				);
				break;
			default:
				break;
		}
	};

	const renderTable = () => {
		if (topResults.length === 0)
			return (
				<NoContent
					mainText="It seems like you haven't listened to enough Spotify..."
					secondaryText="There is no better time than now 😉"
				/>
			);

		switch (topType) {
			case 'artist':
				return colapseTable ? (
					<ArtistCards results={topResults} />
				) : (
					<ArtistTable results={topResults} maxHeight={topResults.length / limit * 100} />
				);
			case 'track':
				return colapseTable ? (
					<TrackCards results={topResults} />
				) : (
					<TrackTable results={topResults} maxHeight={topResults.length / limit * 100} />
				);
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
			if (authToken) history.push(`/top?type=${topType}&time_range=${timeRange}&page=${page}`);
		},
		[ page ]
	);

	useEffect(() => {
		ReactGA.pageview('/top');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>Top Listened - Ascoldata</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum" className="top-content">
				<section className="content-section content-section-top table-content">
					<LoadingSpinner />
					{!promiseInProgress && renderTable()}
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
										<RadioInput
											id="track"
											value="track"
											name="type"
											checked={topType.localeCompare('track') === 0}
											onChange={updateTopType}
											title="Track"
										/>
										<RadioInput
											id="artist"
											value="artist"
											name="type"
											checked={topType.localeCompare('artist') === 0}
											onChange={updateTopType}
											title="Artist"
										/>
									</div>
								</form>
								<form>
									<p> Select a time range: </p>
									<div className="time-labels">
										<RadioInput
											id="short_term"
											value="short_term"
											name="time_range"
											checked={timeRange.localeCompare('short_term') === 0}
											onChange={updateTimeRange}
											title="Short Term"
										/>
										<RadioInput
											id="medium_term"
											value="medium_term"
											name="time_range"
											checked={timeRange.localeCompare('medium_term') === 0}
											onChange={updateTimeRange}
											title="Medium Term"
										/>
										<RadioInput
											id="long_term"
											value="long_term"
											name="time_range"
											checked={timeRange.localeCompare('long_term') === 0}
											onChange={updateTimeRange}
											title="Long Term"
										/>
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
