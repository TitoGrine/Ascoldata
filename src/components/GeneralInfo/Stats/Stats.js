import React, { useState, useEffect } from 'react';
import './Stats.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from './StatCard';

function Stats() {
	const [ stats, setStats ] = useState(JSON.parse(sessionStorage.getItem('userStats')));

    const formatDuration = (duration_ms) => {

        let seconds = Math.round(duration_ms / 1000);
        let minutes = Math.floor(seconds / 60);

       return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
   }

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<h3> · Your Statistics ·</h3>
                    <section id="numbered-data">
                        <StatCard
							barStat={ false }
                            title="Average song duration"
							value={ formatDuration(stats.duration_ms) }
                            units=''
						/>
                        <StatCard
							barStat={ false }
                            title="Average loudness"
							value={ Math.round(stats.loudness) }
                            units='dB'
						/>
                    </section>
					<section id="graphs">
						<StatCard
							barStat={ true }
                            title="Acousticness"
							percentage={stats.acousticness}
							explanation= 'acoustExplanation'
							color="seagreen"
						/>
						<StatCard
							barStat={ true }
                            title="Danceability"
							percentage={stats.danceability}
							explanation='danceExplanation'
							color="violet"
						/>
						<StatCard
							barStat={ true }
                            title="Energy"
							percentage={stats.energy}
							explanation='energyExplanation'
							color="orangered"
						/>
						<StatCard
							barStat={ true }
                            title="Instrumentalness"
							percentage={stats.instrumentalness}
							explanation='instrumExplanation'
							color="limegreen"
						/>
						<StatCard
							barStat={ true }
                            title="Liveness"
							percentage={stats.liveness}
							explanation='liveExplanation'
							color="deepskyblue"
						/>
						<StatCard
							barStat={ true }
                            title="Valence"
							percentage={stats.valence}
							explanation='valExplanation'
							color="orange"
						/>
					</section>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<Tabs>
							<TabList>
								<Tab>Go to</Tab>
							</TabList>

							<TabPanel>
								<Redirects exclude="statistics" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Stats;
