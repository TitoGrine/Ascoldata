import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Spotify from 'spotify-web-api-js';
import { Helmet } from 'react-helmet';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { ISOcodes_array, getCountryFromISOCode } from '../Util/Countries';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import NoContent from '../Common/NoContent';
import PlaylistCards from './PlaylistCards';
import PlaylistTable from './PlaylistTable';

const spotifyWebApi = new Spotify();

function FeaturedPlaylists() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ country, setCountry ] = useState(query.get('country'));
	const [ date, setDate ] = useState(query.get('date'));
	const [ featuredPlaylists, setFeaturedPlaylists ] = useState([]);
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			let options = {
				limit: limit,
				offset: offset,
				timestamp: `${date}${new Date().toISOString().replace(/\d\d\d\d-\d\d-\d\d/g, '').replace(/\..*/g, '')}`
			};

			if (country !== 'ALL') options.country = country;

			trackPromise(
				spotifyWebApi.getFeaturedPlaylists(options).then(
					function(data) {
						// console.log(data);
						setTotalItems(data.playlists.total);
						setFeaturedPlaylists(data.playlists.items);
					},
					function(err) {
						console.log(err);

						if (err.status === 400) setFeaturedPlaylists([]);
						else if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ authToken, offset, country, date ]
	);

	const updateCountry = (ev) => {
		history.push(`/featured_playlists?country=${ev.target.value}&date=${date}&page=${1}`);
	};

	const updateDate = (ev) => {
		history.push(`/featured_playlists?country=${country}&date=${ev.target.value}&page=${1}`);
	};

	const switchPage = (ev) => {
		history.push(`/featured_playlists?country=${country}&date=${date}&page=${Number.isInteger(ev) ? ev : 1}`);
	};

	useEffect(
		() => {
			setCountry(query.get('country'));
			setDate(query.get('date'));
			setPage(parseInt(query.get('page')));
		},
		[ query ]
	);

	useEffect(
		() => {
			if (authToken) {
				getData();
				setOffset(limit * (page - 1));
			}
		},
		[ authToken, page, getData ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/featured_playlists');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${getCountryFromISOCode(country)} featured playlists - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section
					className="content-section table-content"
					ref={table}
					onClick={() => {
						if (toggled.localeCompare('toggled') === 0) toggleButton.current.click();
					}}
				>
					<LoadingSpinner />
					{!promiseInProgress &&
					featuredPlaylists.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<PlaylistCards results={featuredPlaylists} />
							) : (
								<PlaylistTable
									results={featuredPlaylists}
									maxHeight={featuredPlaylists.length / limit * 100}
								/>
							)}
							<Pagination
								activePage={page}
								itemsCountPerPage={limit}
								totalItemsCount={totalItems}
								pageRangeDisplayed={decreasePagination ? 3 : 8}
								onChange={switchPage}
							/>
						</React.Fragment>
					)}
					{!promiseInProgress &&
					featuredPlaylists.length === 0 && (
						<NoContent mainText={`No featured playlists for ${getCountryFromISOCode(country)}...`} />
					)}
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
							<div className="dropdown-country-input">
								<label for="countries"> Select a country: </label>
								<select name="countries" id="countries" onChange={updateCountry}>
									<option key="ALL" value="ALL" selected={'ALL' === country}>
										All
									</option>
									{ISOcodes_array.map((code) => {
										return (
											<option key={code} value={code} selected={code === country}>
												{getCountryFromISOCode(code)}
											</option>
										);
									})}
								</select>
							</div>
							<div className="dropdown-timestamp-input">
								<label for="date"> Select a date: </label>
								<input
									type="date"
									id="date"
									name="date"
									value={date}
									min="2006-04-23"
									max={new Date().toISOString().replace(/T.*/g, '')}
									onChange={updateDate}
								/>
							</div>
						</TabPanel>
						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="featured" />
						</TabPanel>
					</Tabs>
				</div>
				<SideToggle
					ref={toggleButton}
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default FeaturedPlaylists;
