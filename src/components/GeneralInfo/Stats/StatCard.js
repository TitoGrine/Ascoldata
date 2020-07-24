import React from 'react';
import PercentBar from './PercentBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfo } from 'react-icons/md';

function StatCard(props) {
	console.log(props);

	const getCard = () => {
		if (props.barStat) {
			return (
				<div className="stat-card">
					<p>
						{props.title}
						<OverlayTrigger key="top" placement="top" overlay={<Tooltip>{props.explanation}</Tooltip>}>
							<MdInfo />
						</OverlayTrigger>
					</p>
					<strong className="stat-value"> {Math.round(props.percentage) + '%'}</strong>
					<PercentBar percentage={props.percentage} color={props.color} />
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
