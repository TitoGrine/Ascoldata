import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { formatDuration } from '../../HelperFunc';

import Redirects from '../../Redirects';
import StatCard from './StatCard';
import { Textfit } from 'react-textfit';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import HeaderBar from '../../HeaderBar';

function Stats() {
	const stats = JSON.parse(localStorage.getItem('userStats'));
	const [ toggled, setToggled ] = useState('nothing');

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<Textfit className="title" mode="single" max={35}>
						· Your Statistics ·
					</Textfit>
					<div id="misc-info">
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
					</div>
					<div id="stats">
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
