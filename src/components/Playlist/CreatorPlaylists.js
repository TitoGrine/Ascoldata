import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Spotify from 'spotify-web-api-js';
import { trackPromise } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';
import PlaylistCards from './PlaylistCards';
import PlaylistTable from './PlaylistTable';

const spotifyWebApi = new Spotify();

function CreatorPlaylists() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const creatorId = query.get('id');
	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ creatorName, setcreatorName ] = useState('');
	const [ creatorPlaylists, setCreatorPlaylists ] = useState([]);
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		trackPromise(
			spotifyWebApi
				.getUserPlaylists(creatorId, {
					limit: limit,
					offset: offset
				})
				.then(
					function(data) {
						// console.log(data);
						setTotalItems(data.total);
						setCreatorPlaylists(data.items);
						setcreatorName(data.items.length > 0 ? data.items[0].owner.display_name : '');
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
			if (authToken) history.push(`/creator_playlists?id=${creatorId}&page=${page}`);
		},
		[ page ]
	);

	useEffect(() => {
		ReactGA.pageview('/creator_playlists');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${creatorName} Playlists - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section table-content">
					<LoadingSpinner />
					{creatorPlaylists.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<PlaylistCards results={creatorPlaylists} />
							) : (
								<PlaylistTable
									results={creatorPlaylists}
									maxHeight={creatorPlaylists.length / limit * 100}
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
					{creatorPlaylists.length === 0 && (
						<NoContent mainText="This creator doesn't have any playlists..." />
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
							<Redirects exclude="" />
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

export default CreatorPlaylists;
