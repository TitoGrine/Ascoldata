import React, { useState, useEffect } from 'react';
import './Stats.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ProgressBar } from 'react-bootstrap';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import PercentBar from './PercentBar';
import StatCard from './StatCard';

function Stats() {
    const [stats, setStats] = useState(JSON.parse(sessionStorage.getItem('userStats')));

    console.log(stats);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<h3>
						{' '}
						· Statistics ·
					</h3>
                    <div id="graphs">
                        <StatCard title='Acousticness' percentage={ stats.acousticness } color='red' />
                        <StatCard title='Danceability' percentage={ stats.danceability } color='red' />
                        <StatCard title='Energy' percentage={ stats.energy } color='red' />
                        <StatCard title='Instrumentalness' percentage={ stats.instrumentalness } color='red' />
                        <StatCard title='Liveness' percentage={ stats.liveness } color='red' />
                        <StatCard title='Valence' percentage={ stats.valence } color='red' />
                        
                    </div>
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
