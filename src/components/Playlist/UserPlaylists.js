import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import Pagination from 'react-js-pagination';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';

import Redirects from '../Common/Redirects';
import PlaylistTable from './PlaylistTable';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import PlaylistCards from './PlaylistCards';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function UserPlaylists() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ userPlaylists, setUserPlaylists ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi
					.getUserPlaylists({
						limit: limit,
						offset: offset
					})
					.then(
						function(data) {
							// console.log(data);
							setUserPlaylists(data.items);
							setTotalItems(data.total);
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
			);
		},
		[ authToken, offset ]
	);
	const switchPage = (ev) => {
		history.push(`/user_playlists?page=${Number.isInteger(ev) ? ev : 1}`);
	};

	useEffect(
		() => {
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
		[ page, getData, authToken ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/user_playlists');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Your Playlists - Ascoldata`}</title>
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
					userPlaylists.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<PlaylistCards results={userPlaylists} />
							) : (
								<PlaylistTable results={userPlaylists} maxHeight={userPlaylists.length / limit * 100} />
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
					userPlaylists.length === 0 && (
						<NoContent
							mainText="You don't have any playlists 😮"
							secondaryText="Try the Find New Songs segment and we'll create a playlist for you."
						/>
					)}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs defaultIndex={1}>
						<TabList>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="playlists" />
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

export default UserPlaylists;
