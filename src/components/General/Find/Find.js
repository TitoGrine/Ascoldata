import React, { useState } from 'react';
import './Find.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { keyBinds } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import Search from '../Search/Search';
import AttributeSlider from './AttributeSlider';

function Find() {
	const [ acousticness, setAcousticness ] = useState(0.5);
	const [ danceability, setDanceability ] = useState(0.5);
	const [ energy, setEnergy ] = useState(0.5);
	const [ instrumentalness, setInstrumentalness ] = useState(0.5);
	const [ liveness, setLiveness ] = useState(0.5);
	const [ loudness, setLoudness ] = useState(-1);
	const [ popularity, setPopularity ] = useState(0.5);
	const [ speechiness, setSpeechiness ] = useState(0.5);
	const [ valence, setValence ] = useState(0.5);

	const [ key, setKey ] = useState(0);
	const [ mode, setMode ] = useState(-1);

	const submitForm = (ev) => {
		let query = {};

		if (key !== 0) query.key = key;
		if (mode !== -1) query.mode = mode;

		if (acousticness !== -1) query.acousticness = acousticness;
		if (danceability !== -1) query.danceability = danceability;
		if (energy !== -1) query.energy = energy;
		if (instrumentalness !== -1) query.instrumentalness = instrumentalness;
		if (liveness !== -1) query.liveness = liveness;
		if (loudness !== -1) query.loudness = loudness;
		if (popularity !== -1) query.popularity = popularity;
		if (speechiness !== -1) query.speechiness = speechiness;
		if (valence !== -1) query.valence = valence;

		console.log(query);
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
				setPopularity(popularity === -1 ? 0.5 : -1);
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
							<label htmlFor="mode">Mode:</label>
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
							toggle={attributeToggle}
							handler={(ev) => {
								setAcousticness(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Danceability'}
							value={danceability}
							toggle={attributeToggle}
							handler={(ev) => {
								setDanceability(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Energy'}
							value={energy}
							toggle={attributeToggle}
							handler={(ev) => {
								setEnergy(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Instrumentalness'}
							value={instrumentalness}
							toggle={attributeToggle}
							handler={(ev) => {
								setInstrumentalness(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Liveness'}
							value={liveness}
							toggle={attributeToggle}
							handler={(ev) => {
								setLiveness(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Loudness'}
							value={loudness}
							toggle={attributeToggle}
							handler={(ev) => {
								setLoudness(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Popularity'}
							value={popularity}
							toggle={attributeToggle}
							handler={(ev) => {
								setPopularity(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Speechiness'}
							value={speechiness}
							toggle={attributeToggle}
							handler={(ev) => {
								setSpeechiness(parseFloat(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Valence'}
							value={valence}
							toggle={attributeToggle}
							handler={(ev) => {
								setValence(parseFloat(ev.target.value));
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
