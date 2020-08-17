import React from 'react';
import PercentBar from './PercentBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfo } from 'react-icons/md';

import { getExplanation } from '../Util/HelperFunc';

function StatCard(props) {
	const getCard = () => {
		if (props.barStat) {
			return (
				<div className="stat-card">
					<p>
						{props.title}
						<OverlayTrigger
							key="top"
							placement="top"
							overlay={<Tooltip>{getExplanation(props.explanation)}</Tooltip>}
						>
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
					<p>{props.title}</p>
					<strong className="stat-value">
						{props.value}
						<p>{props.units}</p>
					</strong>
				</div>
			);
		}
	};

	return <React.Fragment>{getCard()}</React.Fragment>;
}

export default StatCard;
