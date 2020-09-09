import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';
import AlbumCards from '../Album/AlbumCards';
import AlbumTable from '../Album/AlbumTable';

const spotifyWebApi = new Spotify();

function ArtistAlbums() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const artistId = query.get('id');
	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ artistName, setArtistName ] = useState('');
	const [ artistAlbums, setArtistAlbums ] = useState([]);
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getArtistName = useCallback(
		() => {
			if (artistName.length > 0) return;

			spotifyWebApi.getArtist(artistId).then(
				function(data) {
					setArtistName((artistName) => data.name);
				},
				function(err) {
					console.log(err);
				}
			);
		},
		[ artistId, artistName ]
	);

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi
					.getArtistAlbums(artistId, {
						limit: limit,
						offset: offset
					})
					.then(
						function(data) {
							// console.log(data);
							setTotalItems(data.total);
							setArtistAlbums(data.items);
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
			);
		},
		[ artistId, authToken, offset ]
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

				getArtistName();
			}
		},
		[ authToken, offset, getData, getArtistName ]
	);

	useEffect(
		() => {
			history.push(`/artist_albums?id=${artistId}&page=${page}`);
		},
		[ history, artistId, page ]
	);

	useEffect(() => {
		table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/artist_albums');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${artistName.length > 0 ? artistName : 'Artist'} albums - Ascoldata`}</title>
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
					{artistAlbums.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<AlbumCards results={artistAlbums} />
							) : (
								<AlbumTable results={artistAlbums} maxHeight={artistAlbums.length / limit * 100} />
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
					artistAlbums.length === 0 && <NoContent mainText="Artist doesn't have any albums..." />}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
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

export default ArtistAlbums;
