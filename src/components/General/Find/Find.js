import React, { useState } from 'react';
import './Find.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { keyBinds } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import Search from '../Search/Search';
import AttributeSlider from './AttributeSlider';

import Spotify from 'spotify-web-api-js';
const spotifyWebApi = new Spotify();


const trimLimit = (number, min=0, max=1) => {
	if(isNaN(number))
		return 0;

	return Math.max(min, Math.min(parseFloat(number), max))
}

function Find() {
	const [ seeds ] = useState(sessionStorage.getItem('track_seeds'));

	const [ acousticness, setAcousticness ] = useState(-1);
	const [ danceability, setDanceability ] = useState(-1);
	const [ energy, setEnergy ] = useState(-1);
	const [ instrumentalness, setInstrumentalness ] = useState(-1);
	const [ liveness, setLiveness ] = useState(-1);
	const [ loudness, setLoudness ] = useState(-1);
	const [ popularity, setPopularity ] = useState(-1);
	const [ speechiness, setSpeechiness ] = useState(-1);
	const [ valence, setValence ] = useState(-1);

	const [ key, setKey ] = useState(0);
	const [ mode, setMode ] = useState(-1);

	const submitForm = async (ev) => {
		let query = {
			seed_tracks: seeds
		};

		if (key !== 0) query.target_key = key;
		if (mode !== -1) query.target_mode = mode;

		if (acousticness !== -1) query.target_acousticness = acousticness;
		if (danceability !== -1) query.target_danceability = danceability;
		if (energy !== -1) query.target_energy = energy;
		if (instrumentalness !== -1) query.target_instrumentalness = instrumentalness;
		if (liveness !== -1) query.target_liveness = liveness;
		if (loudness !== -1) query.target_loudness = loudness;
		if (popularity !== -1) query.target_popularity = popularity;
		if (speechiness !== -1) query.target_speechiness = speechiness;
		if (valence !== -1) query.target_valence = valence;

		spotifyWebApi.setAccessToken(sessionStorage.getItem('authToken'));
		console.log(query);

		spotifyWebApi.getRecommendations(query).then(
			function(data){
				console.log(data);
			},
			function(err){
				console.log(err);
			}
		)
	};

	const radioChange = (ev) => {
		setMode(parseInt(ev.target.value));
	};

	const attributeToggle = (attribute) => {
		switch (attribute.toLowerCase()) {
			case 'acousticness':
				setAcousticness(acousticness === -1 ? 0.5 : -1);
				break;
			case 'danceability':
				setDanceability(danceability === -1 ? 0.5 : -1);
				break;
			case 'energy':
				setEnergy(energy === -1 ? 0.5 : -1);
				break;
			case 'instrumentalness':
				setInstrumentalness(instrumentalness === -1 ? 0.5 : -1);
				break;
			case 'liveness':
				setLiveness(liveness === -1 ? 0.5 : -1);
				break;
			case 'loudness':
				setLoudness(loudness === -1 ? 0.5 : -1);
				break;
			case 'popularity':
				setPopularity(popularity === -1 ? 50 : -1);
				break;
			case 'speechiness':
				setSpeechiness(speechiness === -1 ? 0.5 : -1);
				break;
			case 'valence':
				setValence(valence === -1 ? 0.5 : -1);
				break;
		}
	};

	const dropdownChange = (ev) => {
		setKey(parseInt(ev.target.value));
	};

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum" className="find-content">
				<section className="content-section slide-in-left">
					<div id="attribute-inputs">
						<div className="dropdown-value-input" onChange={dropdownChange}>
							<label htmlFor="key">Key:</label>
							<select name="key">
								{keyBinds.map((key, index) => {
									return (
										<option key={key} value={index}>
											{index === 0 ? 'Any' : key}
										</option>
									);
								})}
							</select>
						</div>

						<div className="mode-value-input">
							<label htmlFor="mode">Scale:</label>
							<div className="mode-labels">
								<label>
									<input
										type="radio"
										name="mode"
										value={-1}
										checked={mode === -1}
										onChange={radioChange}
									/>
									<span className="checkmark" />
									Any
								</label>
								<label>
									<input
										type="radio"
										name="mode"
										value={0}
										checked={mode === 0}
										onChange={radioChange}
									/>
									<span className="checkmark" />
									Minor
								</label>
								<label>
									<input
										type="radio"
										name="mode"
										value={1}
										checked={mode === 1}
										onChange={radioChange}
									/>
									<span className="checkmark" />
									Major
								</label>
							</div>
						</div>
					</div>

					<div id="attribute-sliders">
						<AttributeSlider
							name={'Acousticness'}
							value={acousticness}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setAcousticness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Danceability'}
							value={danceability}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setDanceability(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Energy'}
							value={energy}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setEnergy(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Instrumentalness'}
							value={instrumentalness}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setInstrumentalness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Liveness'}
							value={liveness}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setLiveness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Loudness'}
							value={loudness}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setLoudness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Popularity'}
							value={popularity}
							min_value={0}
							max_value={100}
							step={1}
							toggle={attributeToggle}
							handler={(ev) => {
								setPopularity(trimLimit(ev.target.value, 0, 100));
							}}
						/>
						<AttributeSlider
							name={'Speechiness'}
							value={speechiness}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setSpeechiness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Valence'}
							value={valence}
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setValence(trimLimit(ev.target.value));
							}}
						/>
					</div>

					<button className="find-button" onClick={submitForm}>
						Find Songs
					</button>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<Tabs>
							<TabList>
								<Tab>Search</Tab>
								<Tab>Go to</Tab>
							</TabList>

							<TabPanel>
								<Search />
							</TabPanel>
							<TabPanel>
								<Redirects exclude="find" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Find;
