import React, { useState, useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';

import Redirects from '../Common/Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import ArtistTable from '../Artist/ArtistTable';
import PlaylistTable from '../Playlist/PlaylistTable';
import PlaylistCards from '../Playlist/PlaylistCards';
import Search from './Search';
import AlbumTable from '../Album/AlbumTable';
import SideToggle from '../Common/SideToggle';
import TrackCards from '../Track/TrackCards';
import AlbumCards from '../Album/AlbumCards';
import ArtistCards from '../Artist/ArtistCards';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';
import { Alert } from 'react-bootstrap';
import { useCallback } from 'react';

const spotifyWebApi = new Spotify();

function SearchResults() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const q = query.get('q');
	const type = query.get('type');

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ showAlert, setShowAlert ] = useState(false);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ results, setResults ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const autoDismiss = async () => {
		window.setTimeout(() => {
			setShowAlert(false);
		}, 5000);
	};

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi
					.search(q, [ type ], {
						limit: limit,
						offset: offset
					})
					.then(
						function(data) {
							// console.log(data);

							if (data[`${type}s`].items.length === 0 && offset !== 0) {
								setShowAlert(true);
								autoDismiss();
								history.push(`/search?q=${q}&type=${type}&page=${1}`);
							} else {
								setTotalItems(data[`${type}s`].total);
								setResults(data[`${type}s`].items);
							}
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
			);
		},
		[ authToken, offset, q, type, history ]
	);

	const switchPage = (ev) => {
		history.push(`/search?q=${q}&type=${type}&page=${Number.isInteger(ev) ? ev : 1}`);
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
		[ authToken, page, getData ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/search');
	});

	const renderTable = () => {
		if (results.length === 0) return <NoContent mainText={`Couldn't find any ${type}s with that name 😞`} />;

		switch (type) {
			case 'artist':
				return colapseTable ? (
					<ArtistCards results={results} />
				) : (
					<ArtistTable results={results} maxHeight={results.length / limit * 100} />
				);
			case 'album':
				return colapseTable ? (
					<AlbumCards results={results} />
				) : (
					<AlbumTable results={results} maxHeight={results.length / limit * 100} />
				);
			case 'playlist':
				return colapseTable ? (
					<PlaylistCards results={results} />
				) : (
					<PlaylistTable results={results} maxHeight={results.length / limit * 100} />
				);
			case 'track':
				return colapseTable ? (
					<TrackCards results={results} />
				) : (
					<TrackTable results={results} maxHeight={results.length / limit * 100} />
				);
			default:
				return;
		}
	};

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${q} - Ascoldata`}</title>
			</Helmet>
			<Alert
				variant="warning"
				show={showAlert}
				onClose={() => {
					setShowAlert(false);
				}}
				dismissible
			>
				<Alert.Heading>Ups!</Alert.Heading>
				<p>The page you were trying to see doesn't actually have any {type}s. Sorry about that!</p>
			</Alert>
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
					{results.length > 0 && (
						<React.Fragment>
							{renderTable()}
							<Pagination
								activePage={page}
								itemsCountPerPage={limit}
								totalItemsCount={totalItems}
								pageRangeDisplayed={decreasePagination ? 3 : 8}
								onChange={switchPage}
							/>
						</React.Fragment>
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
							<Redirects exclude="" />
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

export default SearchResults;
