import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactGA from 'react-ga';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Textfit } from 'react-textfit';
import { FaSpotify } from 'react-icons/fa';

import { refreshToken } from '../Auth/Auth';
import { getCountryFromISOCode } from '../Util/Countries';
import default_image from '../../assets/images/default_pic.png';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import { calcUserValues } from '../Util/Compatibility';

const spotifyWebApi = new Spotify();

function User() {
	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);

	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ user, setUser ] = useState('');
	const [ id, setId ] = useState('');
	const [ image, setImage ] = useState(default_image);
	const [ email, setEmail ] = useState('');
	const [ country, setCountry ] = useState('');
	const [ followers, setFollowers ] = useState('');
	const [ product, setProduct ] = useState('');
	const [ link, setLink ] = useState('');
	const [ displayTrack, setDisplayTrack ] = useState('');

	const { promiseInProgress } = usePromiseTracker();

	const getUserSeeds = async () => {
		spotifyWebApi
			.getMyTopTracks({
				limit: 5,
				offset: 0,
				time_range: 'short_term'
			})
			.then(
				function(data) {
					let tracks = data.items.map((track) => {
						return track.id;
					});

					localStorage.setItem('track_seeds', tracks);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			);
	};

	const getLastTrack = () => {
		spotifyWebApi
			.getMyRecentlyPlayedTracks({
				limit: 1
			})
			.then(
				function(data) {
					if (data.items.length > 0) setDisplayTrack(data.items[0].track.uri);
				},
				function(err) {
					console.log(err);
				}
			);
	};

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi.getMe().then(
					function(data) {
						//console.log(data);

						if (data.images.length > 0) setImage(data.images[0].url);

						setUser(data.display_name);
						setId(data.id);
						setEmail(data.email);
						setCountry(getCountryFromISOCode(data.country));
						setFollowers(data.followers.total);
						setProduct(data.product);
						setLink(data.external_urls.spotify);

						localStorage.setItem('userId', data.id);
						localStorage.setItem('country', data.country);

						getUserSeeds();
						getLastTrack();
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
			);
		},
		[ authToken ]
	);

	useEffect(
		() => {
			if (authToken) {
				getData();
				calcUserValues(authToken);
			}
		},
		[ authToken, getData ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${user.length === 0 ? 'User' : user} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section
					className="content-section"
					onClick={() => {
						if (toggled.localeCompare('toggled') === 0) toggleButton.current.click();
					}}
				>
					<LoadingSpinner />
					{!promiseInProgress && (
						<div id="profile-info">
							<Textfit className="username" mode="single" max={36}>
								· Hello<strong> {user} </strong> ·
							</Textfit>
							<a
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								className="icon-link spotify-icon-link heartbeat"
								onClick={() => {
									ReactGA.event({
										category: 'Interaction',
										action: 'Clicked on Spotify link for user.',
										label: 'Link Event'
									});
								}}
							>
								<FaSpotify />
							</a>
							<div id="info">
								<div id="image">
									<Image src={image} thumbnail />
								</div>
								<ul id="user-info">
									<li>
										<strong>ID:</strong> {id}
									</li>
									<li>
										<strong>Email:</strong> {email}
									</li>
									<li>
										<strong>Country:</strong> {country}
									</li>
									<li>
										<strong>Subscription:</strong> {product}
									</li>
									<li>
										<strong>No. followers:</strong> {followers}
									</li>
									{displayTrack.length !== 0 && (
										<li className="played_song">
											<strong>Last Played:</strong>
											<iframe
												src={`https://embed.spotify.com/?uri=${displayTrack}&view=list&theme=black`}
												width="350"
												height="80"
												frameBorder="0"
												allowtransparency="true"
												title="last_played_song_preview"
												allow="encrypted-media"
											/>
										</li>
									)}
								</ul>
							</div>
						</div>
					)}
					<div id="mobile-separator" />
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
							<Redirects exclude="home" />
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

export default User;
