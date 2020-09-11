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
import AlbumCards from '../Album/AlbumCards';
import AlbumTable from '../Album/AlbumTable';

const spotifyWebApi = new Spotify();

function NewReleases() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ country, setCountry ] = useState(query.get('country'));
	const [ newReleases, setNewReleases ] = useState([]);
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
				offset: offset
			};

			if (country !== 'ALL') options.country = country;

			trackPromise(
				spotifyWebApi.getNewReleases(options).then(
					function(data) {
						//console.log(data);
						setTotalItems(data.albums.total);
						setNewReleases(data.albums.items);
					},
					function(err) {
						console.log(err);

						if (err.status === 400) setNewReleases([]);
						else if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ authToken, offset, country ]
	);

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
		[ authToken, offset, getData ]
	);

	useEffect(
		() => {
			history.push(`/new_releases?country=${country}&page=${page}`);
		},
		[ history, page, country ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/new_releases');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${getCountryFromISOCode(country)} new releases - Ascoldata`}</title>
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
					{newReleases.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<AlbumCards results={newReleases} />
							) : (
								<AlbumTable results={newReleases} maxHeight={newReleases.length / limit * 100} />
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
					newReleases.length === 0 && (
						<NoContent mainText={`No new releases for ${getCountryFromISOCode(country)}...`} />
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
							<div
								className="dropdown-country-input"
								onChange={(ev) => {
									setCountry(ev.target.value);
								}}
							>
								<label for="countries"> Select a country: </label>
								<select name="countries" id="countries">
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
						</TabPanel>
						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="releases" />
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

export default NewReleases;
