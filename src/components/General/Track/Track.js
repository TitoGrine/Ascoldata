import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { useLocation, Link } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';

import { refreshToken } from '../../Auth/Auth';
import { keyBinds } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';

const spotifyWebApi = new Spotify();

function Track() {
	const query = new URLSearchParams(useLocation().search);
	const track = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ trackLink, setTrackLink ] = useState('');
	const [ trackName, setTrackName ] = useState('');
	const [ trackAlbum, setTrackAlbum ] = useState('');
	const [ trackArtists, setTrackArtists ] = useState('');
	const [ trackDuration, setTrackDuration ] = useState('');
	const [ trackPopularity, setTrackPopularity ] = useState('');

	const [ trackStats, setTrackStats ] = useState({});

	const formatDuration = (duration_ms) => {
		let seconds = Math.round(duration_ms / 1000);
		let minutes = Math.floor(seconds / 60);

		return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
	};

	const getTrackMetaData = async () => {
		spotifyWebApi.getTrack(track).then(
			function(data) {
				setTrackName(data.name);
				setTrackLink(data.external_urls.spotify);
				setTrackAlbum(data.album);
				setTrackArtists(data.artists);
				setTrackDuration(data.duration_ms);
				setTrackPopularity(data.popularity);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
		);
	};

	const getTrackFeatures = async () => {
		spotifyWebApi.getAudioFeaturesForTrack(track).then(
			function(data) {
				const avgStats = {
					acousticness: 100 * data.acousticness,
					danceability: 100 * data.danceability,
					energy: 100 * data.energy,
					instrumentalness: 100 * data.instrumentalness,
					liveness: 100 * data.liveness,
					loudness: data.loudness,
					mode: data.mode,
					speechiness: 100 * data.speechiness,
					tempo: data.tempo,
					valence: 100 * data.valence,
					pitchKey: data.key
				};

				setTrackStats(avgStats);
			},
			function(err) {
				console.log(err);
			}
		);
	};

	const getData = async () => {
		getTrackMetaData();
		getTrackFeatures();
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getData();
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<div id="corporum">
				<section className="content-section slide-in-left">
					<Textfit className="track-title" mode="single" max={36}>
						· {trackName} ·
					</Textfit>
					<a href={trackLink} target="_blank">
						<FaSpotify className="title-icon-link heartbeat" />
					</a>

					<div id="track-info">
						<StatCard
							barStat={false}
							title="Album"
							value={
								<Link key={trackAlbum.id} to={'/album?id=' + trackAlbum.id} className="inner-link">
									{trackAlbum.name}
								</Link>
							}
							units=""
						/>
						<StatCard
							barStat={false}
							title="Artist"
							value={
								trackArtists === '' ? (
									''
								) : (
									trackArtists
										.map((artist) => {
											return (
												<Link
													key={artist.id}
													to={'/artist?id=' + artist.id}
													className="inner-link"
												>
													{artist.name}
												</Link>
											);
										})
										.slice(0, 2)
								)
							}
							units=""
						/>
						<StatCard barStat={false} title="Duration" value={formatDuration(trackDuration)} units="" />
						<StatCard barStat={false} title="Key" value={keyBinds[trackStats.pitchKey + 1]} units="" />
						<StatCard barStat={false} title="Popularity" value={trackPopularity} units="" />
					</div>
					<div id="stats">
						<StatCard
							barStat={true}
							title="Acousticness"
							percentage={trackStats.acousticness}
							explanation="acoustExplanation"
							color="seagreen"
						/>
						<StatCard
							barStat={true}
							title="Danceability"
							percentage={trackStats.danceability}
							explanation="danceExplanation"
							color="violet"
						/>
						<StatCard
							barStat={true}
							title="Energy"
							percentage={trackStats.energy}
							explanation="energyExplanation"
							color="orangered"
						/>
						<StatCard
							barStat={true}
							title="Instrumentalness"
							percentage={trackStats.instrumentalness}
							explanation="instrumExplanation"
							color="limegreen"
						/>
						<StatCard
							barStat={true}
							title="Liveness"
							percentage={trackStats.liveness}
							explanation="liveExplanation"
							color="deepskyblue"
						/>
						<StatCard
							barStat={true}
							title="Valence"
							percentage={trackStats.valence}
							explanation="valExplanation"
							color="orange"
						/>
						<div id="mobile-separator" />
					</div>
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

export default Track;
