import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise } from 'react-promise-tracker';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';

import Redirects from '../Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import Search from '../Search/Search';
import SideToggle from '../SideToggle';
import TrackCards from '../Track/TrackCards';
import HeaderBar from '../HeaderBar';
import LoadingSpinner from '../LoadingSpinner';

const spotifyWebApi = new Spotify();

function Liked() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ userLiked, setUserLiked ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		trackPromise(
			spotifyWebApi
				.getMySavedTracks({
					limit: limit,
					offset: offset
				})
				.then(
					function(data) {
						//console.log(data);
						setUserLiked(data.items);
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
		[ authToken, offset ]
	);

	useEffect(
		() => {
			history.push(`/liked?page=${page}`);
		},
		[ page ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Your Liked Songs - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section table-content">
					<LoadingSpinner />
					{userLiked.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<TrackCards results={userLiked} />
							) : (
								<TrackTable results={userLiked} maxHeight={userLiked.length / limit * 100} />
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
							<Redirects exclude="liked" />
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

export default Liked;
