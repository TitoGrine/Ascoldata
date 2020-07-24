import React from 'react';
import PercentBar from './PercentBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function StatCard(props) {
	console.log(props);

	return (
		<div className="stat-card">
			<OverlayTrigger
				key='top'
				placement='top'
				overlay={
					<Tooltip>
						{ props.explanation }
					</Tooltip>
				}
			>
				<p>{props.title}</p>
			</OverlayTrigger>
			<strong> {Math.round(props.percentage) + '%'}</strong>
			<PercentBar percentage={props.percentage} color={props.color} />
		</div>
	);
}

export default StatCard;
