import React from 'react';
import './StatCard.css';
import PercentBar from './PercentBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfo } from 'react-icons/md';

function StatCard(props) {

	const getExplanation = () => {

		switch(props.explanation){
			case 'acoustExplanation':
				return 'Acousticness measures how acoustic the songs are.';
			case 'danceExplanation':
				return 'Danceability describes how suitable the songs are for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.';
			case 'energyExplanation':
				return 'Energy represents a perceptual measure of intensity and activity. Typically, energetic songs feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.';
			case 'instrumExplanation':
				return 'Instrumentalness measures how likely the songs are to not contain vocals.';
			case 'liveExplanation':
				return 'Liveness predicts the likelyhood the songs are played live, that is, in the presence of an audience.';
			case 'valExplanation':
				return 'Valence measures how positive the songs are. High valence means positive songs, while low valence represents more negative songs.';
			default:
				return 'No information..';
		}
	}

	

	const getCard = () => {
		if (props.barStat) {
			return (
				<div className="stat-card">
					<p>
						{props.title}
						<OverlayTrigger key="top" placement="top" overlay={<Tooltip>{ getExplanation() }</Tooltip>}>
							<MdInfo />
						</OverlayTrigger>
					</p>
					<strong className="stat-value"> {Math.round(props.percentage) + '%'}</strong>
					<PercentBar percentage={Math.round(props.percentage)} color={props.color} />
				</div>
			);
		} else {
            return (
                <div className="stat-card">
					<p>
						{props.title}
					</p>
					<strong className="stat-value"> {props.value + ' ' + props.units}</strong>
				</div>
            )
        }
	};

	return <React.Fragment>{getCard()}</React.Fragment>;
}

export default StatCard;
