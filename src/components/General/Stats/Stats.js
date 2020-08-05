import React, { useState } from 'react';
import './Stats.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { formatDuration } from '../../HelperFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from './StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';

function Stats() {
	const stats = JSON.parse(sessionStorage.getItem('userStats'));
	const [ toggled, setToggled ] = useState('closed');

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<Textfit className="title" mode="single" max={35}>
						· Your Statistics ·
					</Textfit>
					<section id="numbered-data">
						<StatCard
							barStat={false}
							title="Average song duration"
							value={formatDuration(stats.duration_ms)}
							units=""
						/>
						<StatCard
							barStat={false}
							title="Average loudness"
							value={Math.round(stats.loudness)}
							units="dB"
						/>
						<StatCard barStat={false} title="Average tempo" value={Math.round(stats.tempo)} units="bpm" />
						<StatCard barStat={false} title="Popularity" value={Math.round(stats.popularity)} units="" />
					</section>
					<section id="graphs">
						<StatCard
							barStat={true}
							title="Acousticness"
							percentage={stats.acousticness}
							explanation="acoustExplanation"
							color="seagreen"
						/>
						<StatCard
							barStat={true}
							title="Danceability"
							percentage={stats.danceability}
							explanation="danceExplanation"
							color="violet"
						/>
						<StatCard
							barStat={true}
							title="Energy"
							percentage={stats.energy}
							explanation="energyExplanation"
							color="orangered"
						/>
						<StatCard
							barStat={true}
							title="Instrumentalness"
							percentage={stats.instrumentalness}
							explanation="instrumExplanation"
							color="limegreen"
						/>
						<StatCard
							barStat={true}
							title="Liveness"
							percentage={stats.liveness}
							explanation="liveExplanation"
							color="deepskyblue"
						/>
						<StatCard
							barStat={true}
							title="Valence"
							percentage={stats.valence}
							explanation="valExplanation"
							color="orange"
						/>
					</section>
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
							<Redirects exclude="statistics" />
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

export default Stats;
