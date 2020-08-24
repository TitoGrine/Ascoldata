import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useHistory, Redirect } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoIosStats } from 'react-icons/io';
import { GiRollingDices } from 'react-icons/gi';
import { keyBinds, trimLimit, getExplanation, randomInt } from '../Util/HelperFunc';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import AttributeSlider from './AttributeSlider';

import SideToggle from '../Common/SideToggle';
import HeaderBar from '../Common/HeaderBar';
import { Helmet } from 'react-helmet';

function Find() {
	const [ toggled, setToggled ] = useState('nothing');
	const [ acousticness, setAcousticness ] = useState(-1);
	const [ danceability, setDanceability ] = useState(-1);
	const [ energy, setEnergy ] = useState(-1);
	const [ instrumentalness, setInstrumentalness ] = useState(-1);
	const [ liveness, setLiveness ] = useState(-1);
	const [ tempo, setTempo ] = useState(-1);
	const [ popularity, setPopularity ] = useState(-1);
	const [ speechiness, setSpeechiness ] = useState(-1);
	const [ valence, setValence ] = useState(-1);

	const [ key, setKey ] = useState(0);
	const [ mode, setMode ] = useState(-1);

	const history = useHistory();

	const submitForm = async (ev) => {
		let link = `/recommendations?`;

		if (key !== 0) link += `&key=${key}`;
		if (mode !== -1) link += `&mode=${mode}`;

		if (acousticness !== -1) link += `&acousticness=${acousticness}`;
		if (danceability !== -1) link += `&danceability=${danceability}`;
		if (energy !== -1) link += `&energy=${energy}`;
		if (instrumentalness !== -1) link += `&instrumentalness=${instrumentalness}`;
		if (liveness !== -1) link += `&liveness=${liveness}`;
		if (tempo !== -1) link += `&tempo=${tempo}`;
		if (popularity !== -1) link += `&popularity=${popularity}`;
		if (speechiness !== -1) link += `&speechiness=${speechiness}`;
		if (valence !== -1) link += `&valence=${valence}`;

		history.push(link);
	};

	const setUserStats = () => {
		let userStats = JSON.parse(localStorage.getItem('compatibilityValues'));

		if (userStats) {
			setAcousticness(userStats.acousticness.toFixed(3));
			setDanceability(userStats.danceability.toFixed(3));
			setEnergy(userStats.energy.toFixed(3));
			setInstrumentalness(userStats.instrumentalness.toFixed(3));
			setLiveness(userStats.liveness.toFixed(3));
			setSpeechiness(userStats.speechiness.toFixed(3));
			setPopularity(parseInt(userStats.popularity));
			setTempo(parseInt(userStats.tempo));
			setValence(userStats.valence.toFixed(3));
		}
	};

	const setRandomStats = () => {
		setKey(randomInt(1, 12));
		setMode(Math.round(Math.random()));

		setAcousticness(Math.random().toFixed(3));
		setDanceability(Math.random().toFixed(3));
		setEnergy(Math.random().toFixed(3));
		setInstrumentalness(Math.random().toFixed(3));
		setLiveness(Math.random().toFixed(3));
		setSpeechiness(Math.random().toFixed(3));
		setPopularity(randomInt(0, 100));
		setTempo(randomInt(0, 250));
		setValence(Math.random().toFixed(3));
	};

	const keyChange = (ev) => {
		setKey(parseInt(ev.target.value));
	};

	const modeChange = (ev) => {
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
			case 'tempo':
				setTempo(tempo === -1 ? 140 : -1);
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

	if (!localStorage.getItem('refreshToken')) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Find Songs - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum" className="find-content">
				<section className="content-section">
					<OverlayTrigger placement="top" overlay={<Tooltip>Randomize all attributes!</Tooltip>}>
						<button className="icon-link random-stats-icon-link heartbeat" onClick={() => setRandomStats()}>
							<GiRollingDices />
						</button>
					</OverlayTrigger>

					<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip>
								Set the attributes to the weighted average values of your top and liked tracks
							</Tooltip>
						}
					>
						<button className="icon-link default-stats-icon-link heartbeat" onClick={() => setUserStats()}>
							<IoIosStats />
						</button>
					</OverlayTrigger>
					<div id="attribute-inputs">
						<div className="dropdown-value-input" onChange={keyChange}>
							<OverlayTrigger
								key="none"
								placement="top"
								overlay={<Tooltip>{getExplanation('keyExplanation')}</Tooltip>}
							>
								<label htmlFor="key">Key:</label>
							</OverlayTrigger>
							<select name="key">
								{keyBinds.map((keyBind, index) => {
									return (
										<option key={keyBind} value={index} selected={index === key}>
											{index === 0 ? 'Any' : keyBind}
										</option>
									);
								})}
							</select>
						</div>

						<div className="dropdown-value-input" onChange={modeChange}>
							<OverlayTrigger
								key="none"
								placement="top"
								overlay={<Tooltip>{getExplanation('modeExplanation')}</Tooltip>}
							>
								<label htmlFor="mode">Mode:</label>
							</OverlayTrigger>
							<select name="mode">
								<option value={-1} selected={mode === -1}>
									Any
								</option>
								<option value={0} selected={mode === 0}>
									Minor
								</option>
								<option value={1} selected={mode === 1}>
									Major
								</option>
							</select>
						</div>
					</div>

					<div id="attribute-sliders">
						<AttributeSlider
							name={'Acousticness'}
							value={acousticness}
							explanation="acoustExplanation"
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
							explanation="danceExplanation"
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
							explanation="energyExplanation"
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
							explanation="instrumExplanation"
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
							explanation="liveExplanation"
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setLiveness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Speechiness'}
							value={speechiness}
							explanation="speechExplanation"
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setSpeechiness(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Popularity'}
							value={popularity}
							explanation="popExplanation"
							min_value={0}
							max_value={100}
							step={1}
							toggle={attributeToggle}
							handler={(ev) => {
								setPopularity(trimLimit(ev.target.value, 0, 100));
							}}
						/>
						<AttributeSlider
							name={'Valence'}
							value={valence}
							explanation="valExplanation"
							min_value={0}
							max_value={1}
							step={0.01}
							toggle={attributeToggle}
							handler={(ev) => {
								setValence(trimLimit(ev.target.value));
							}}
						/>
						<AttributeSlider
							name={'Tempo'}
							value={tempo}
							explanation="tempoExplanation"
							min_value={0}
							max_value={250}
							step={1}
							toggle={attributeToggle}
							handler={(ev) => {
								setTempo(trimLimit(ev.target.value, 0, 250));
							}}
						/>
					</div>

					<button className="find-button" onClick={submitForm}>
						Find Songs
					</button>
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Instructions</Tab>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel className="instructions-tab">
							<p>
								In here you can find songs using Spotify's recommendations functionality and control it
								using various attributes.
								<br />Every attribute for which you select a value, Spotify will try to find songs with
								values close to the ones you choose, while still being a good match for your tastes.
								<br />If you are not sure what an attribute is exactly, <strong>hover on it</strong> and
								see an explanation based on Spotify's documentation.
								<br />If you don't select anything, then you will get recommendations based on your
								latest top heard songs.
								<br />
								<strong>Have fun 😄!</strong>
								<br />
							</p>
						</TabPanel>
						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="find" />
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

export default Find;
