import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation } from 'react-router-dom';
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
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ artistName, setArtistName ] = useState('');
	const [ relatedArtists, setRelatedArtists ] = useState([]);

	const colapseTable = useMediaQuery({ maxWidth: 700 });

	const getData = () => {
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
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${artistName} related artists - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section table-content">
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

export default RelatedArtists;
