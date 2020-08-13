import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import Pagination from 'react-js-pagination';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';

import Redirects from '../Redirects';
import PlaylistTable from './PlaylistTable';
import Search from '../Search/Search';
import SideToggle from '../SideToggle';
import PlaylistCards from './PlaylistCards';
import HeaderBar from '../HeaderBar';
import LoadingSpinner from '../LoadingSpinner';

const spotifyWebApi = new Spotify();

function UserPlaylists() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ userPlaylists, setUserPlaylists ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const { promiseInProgress } = usePromiseTracker();

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		trackPromise(
			spotifyWebApi
				.getUserPlaylists({
					limit: limit,
					offset: offset
				})
				.then(
					function(data) {
						//console.log(data);
						setUserPlaylists(data.items);
						setTotalItems(data.total);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
		);
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
		[ offset ]
	);

	useEffect(
		() => {
			history.push(`/playlists?page=${page}`);
		},
		[ page ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Your Playlists - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum" className="playlists-content">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress &&
						(colapseTable ? (
							<PlaylistCards results={userPlaylists} />
						) : (
							<PlaylistTable results={userPlaylists} />
						))}
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
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default UserPlaylists;