import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Redirect } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { Helmet } from 'react-helmet';
import Spotify from 'spotify-web-api-js';

import { refreshToken } from '../Auth/Auth';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import ArtistCards from './ArtistCards';
import ArtistTable from './ArtistTable';

const spotifyWebApi = new Spotify();

function RelatedArtists() {
	const query = new URLSearchParams(useLocation().search);

	const artistId = query.get('id');
	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);
	const table = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ artistName, setArtistName ] = useState('');
	const [ relatedArtists, setRelatedArtists ] = useState([]);

	const colapseTable = useMediaQuery({ maxWidth: 700 });

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
				spotifyWebApi.getArtistRelatedArtists(artistId).then(
					function(data) {
						// console.log(data);
						setRelatedArtists(data.artists);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ artistId, authToken ]
	);

	useEffect(
		() => {
			if (authToken) {
				getData();

				getArtistName();
			}
		},
		[ authToken, getData, getArtistName ]
	);

	useEffect(() => {
		if (table.current) table.current.scrollTo(0, 0);
	});

	useEffect(() => {
		ReactGA.pageview('/related_artists');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${artistName} related artists - Ascoldata`}</title>
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
					{relatedArtists.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<ArtistCards results={relatedArtists} />
							) : (
								<ArtistTable results={relatedArtists} />
							)}
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

export default RelatedArtists;
