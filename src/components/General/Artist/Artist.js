import React, { useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { useLocation } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaSpotify } from 'react-icons/fa';

import { refreshToken } from '../../Auth/Auth';

import Redirects from '../../Redirects';
import StatCard from '../Stats/StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';

const spotifyWebApi = new Spotify();

function Artist() {
	const query = new URLSearchParams(useLocation().search);
	const artist = query.get('id');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ artistName, setArtistName ] = useState('');
	const [ artistLink, setArtistLink ] = useState('');
	const [ artistImage, setArtistImage ] = useState('');
	const [ artistFollowers, setArtistFollowers ] = useState('');
	const [ artistGenres, setArtistGenres ] = useState('');
	const [ artistPopularity, setArtistPopularity ] = useState('');

	const [ artistStats, setArtistStats ] = useState({});

	const getArtistMetaData = async () => {
		spotifyWebApi.getArtist(artist).then(
			function(data) {
				setArtistName(data.name);
				setArtistLink(data.external_urls.spotify);
				setArtistImage(data.images.length === 0 ? '' : data.images[0].url);
				setArtistFollowers(data.followers.total);
				setArtistGenres(data.genres);
				setArtistPopularity(data.popularity);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
		);
	};

	const getArtistTopTracks = async () => {
		spotifyWebApi.getArtistTopTracks(artist, localStorage.getItem('country')).then(
			function(data) {
				getArtistStats(
					data.tracks.map((track) => {
						return track.id;
					})
				);
			},
			function(err) {
				console.log(err);
			}
		);
	};

	const getArtistStats = async (tracks) => {
		spotifyWebApi.getAudioFeaturesForTracks(tracks).then(
			function(data) {
				const avgStats = {
					acousticness: 0,
					danceability: 0,
					duration_ms: 0,
					energy: 0,
					instrumentalness: 0,
					liveness: 0,
					loudness: 0,
					mode: 0,
					speechiness: 0,
					tempo: 0,
					valence: 0
				};

				data.audio_features.forEach((track_info) => {
					avgStats.acousticness += 100 * track_info.acousticness / data.audio_features.length;
					avgStats.danceability += 100 * track_info.danceability / data.audio_features.length;
					avgStats.duration_ms += track_info.duration_ms / data.audio_features.length;
					avgStats.energy += 100 * track_info.energy / data.audio_features.length;
					avgStats.instrumentalness += 100 * track_info.instrumentalness / data.audio_features.length;
					avgStats.liveness += 100 * track_info.liveness / data.audio_features.length;
					avgStats.loudness += track_info.loudness / data.audio_features.length;
					avgStats.mode += track_info.mode;
					avgStats.speechiness += 100 * track_info.speechiness / data.audio_features.length;
					avgStats.tempo += track_info.tempo / data.audio_features.length;
					avgStats.valence += 100 * track_info.valence / data.audio_features.length;
				});

				setArtistStats(avgStats);
			},
			function(err) {
				console.log(err);

				if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
			}
		);
	};

	const getData = async () => {
		getArtistMetaData();
		getArtistTopTracks();
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
					<Textfit className="artist-title" mode="single" max={36}>
						{' '}
						· {artistName} ·{' '}
					</Textfit>
					<a href={artistLink} target="_blank">
						<FaSpotify className="title-icon-link heartbeat" />
					</a>

					<div id="artist-info">
						<div id="image">
							<Image src={artistImage} thumbnail />
						</div>
						<StatCard barStat={false} title="Followers" value={artistFollowers} units="" />
						<StatCard
							barStat={false}
							title="Genre"
							value={artistGenres.length === 0 ? 'undefined' : artistGenres[0]}
							units=""
						/>
						<StatCard barStat={false} title="Popularity" value={artistPopularity} units="" />
					</div>
					<div id="stats">
						<StatCard
							barStat={true}
							title="Acousticness"
							percentage={artistStats.acousticness}
							explanation="acoustExplanation"
							color="seagreen"
						/>
						<StatCard
							barStat={true}
							title="Danceability"
							percentage={artistStats.danceability}
							explanation="danceExplanation"
							color="violet"
						/>
						<StatCard
							barStat={true}
							title="Energy"
							percentage={artistStats.energy}
							explanation="energyExplanation"
							color="orangered"
						/>
						<StatCard
							barStat={true}
							title="Instrumentalness"
							percentage={artistStats.instrumentalness}
							explanation="instrumExplanation"
							color="limegreen"
						/>
						<StatCard
							barStat={true}
							title="Liveness"
							percentage={artistStats.liveness}
							explanation="liveExplanation"
							color="deepskyblue"
						/>
						<StatCard
							barStat={true}
							title="Valence"
							percentage={artistStats.valence}
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

export default Artist;
