import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Helmet } from 'react-helmet';

import { refreshToken } from '../Auth/Auth';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import NoContent from '../Common/NoContent';
import ArtistCards from '../Artist/ArtistCards';
import ArtistTable from '../Artist/ArtistTable';
import { Redirect } from 'react-router-dom';

const spotifyWebApi = new Spotify();

function Followed() {
	const limit = 12;

	const { promiseInProgress } = usePromiseTracker();

	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ userFollowed, setUserFollowed ] = useState([]);
	const [ pages, setPages ] = useState([ '' ]);
	const [ currPage, setCurrPage ] = useState(0);
	const [ maxPage, setMaxPage ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });

	const getData = useCallback(
		() => {
			let options = {
				limit: limit
			};

			if (pages[currPage].length > 0) options.after = pages[currPage];

			trackPromise(
				spotifyWebApi.getFollowedArtists(options).then(
					function(data) {
						// console.log(data.artists);
						setUserFollowed(data.artists.items);
						setMaxPage(Math.floor(data.artists.total / limit));

						if (data.artists.cursors.after && !pages.includes(data.artists.cursors.after))
							setPages([ ...pages, data.artists.cursors.after ]);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ currPage, pages ]
	);

	const changePage = (direction) => {
		let newPage = currPage + direction;

		if (newPage >= 0 && newPage <= maxPage) setCurrPage(newPage);
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getData();
			}
		},
		[ authToken, currPage, getData ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/followed');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Followed Artists - Ascoldata`}</title>
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
					{userFollowed.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<ArtistCards results={userFollowed} />
							) : (
								<ArtistTable results={userFollowed} maxHeight={userFollowed.length / limit * 100} />
							)}
							<ul className="pagination">
								<li className={`${currPage === 0 ? 'disabled' : ''}`}>
									<button onClick={() => changePage(-1)}>⟨</button>
								</li>
								<li className={`${currPage === maxPage ? 'disabled' : ''}`}>
									<button onClick={() => changePage(+1)}>⟩</button>
								</li>
							</ul>
						</React.Fragment>
					)}
					{!promiseInProgress &&
					userFollowed.length === 0 && <NoContent mainText="You haven't followed any artists 😮" />}
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
							<Redirects exclude="followed" />
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

export default Followed;
