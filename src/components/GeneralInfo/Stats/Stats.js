import React, { useState, useEffect } from 'react';
import './Stats.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import StatCard from './StatCard';

function Stats() {
	const [ stats, setStats ] = useState(JSON.parse(sessionStorage.getItem('userStats')));

    console.log(stats);

    const formatDuration = (duration_ms) => {

        let seconds = Math.round(duration_ms / 1000);
        let minutes = Math.floor(seconds / 60);

       return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
   }

	const acoustExplanation = 'Acousticness measures how acoustic your favourite songs are.';
	const danceExplanation =
		'Danceability describes how suitable your favourite songs are for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.';
	const energyExplanation =
		'Energy represents a perceptual measure of intensity and activity. Typically, energetic songs feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.';
	const instrumExplanation = 'Instrumentalness measures how likely your favourite songs are to not contain vocals.';
	const liveExplanation =
		'Liveness predicts the likelyhood your favourite songs are played live, that is, in the presence of an audience.';
	const valExplanation =
		'Valence measures how positive your favourite songs are. High valence means positive songs, while low valence represents more negative songs.';

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<h3> · Statistics ·</h3>
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
                            units='db'
						/>
                    </section>
					<section id="graphs">
						<StatCard
							barStat={ true }
                            title="Acousticness"
							percentage={stats.acousticness}
							explanation={acoustExplanation}
							color="seagreen"
						/>
						<StatCard
							barStat={ true }
                            title="Danceability"
							percentage={stats.danceability}
							explanation={danceExplanation}
							color="violet"
						/>
						<StatCard
							barStat={ true }
                            title="Energy"
							percentage={stats.energy}
							explanation={energyExplanation}
							color="orangered"
						/>
						<StatCard
							barStat={ true }
                            title="Instrumentalness"
							percentage={stats.instrumentalness}
							explanation={instrumExplanation}
							color="limegreen"
						/>
						<StatCard
							barStat={ true }
                            title="Liveness"
							percentage={stats.liveness}
							explanation={liveExplanation}
							color="deepskyblue"
						/>
						<StatCard
							barStat={ true }
                            title="Valence"
							percentage={stats.valence}
							explanation={valExplanation}
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
								<Redirects exclude="top" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Stats;
