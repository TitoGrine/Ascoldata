import React from 'react';

function PercentBar(props) {
	const borders = props.percentage < 99 ? '2em 0 0 2em' : '2em';
	const height = (0.6 + 0.4 * (props.percentage > 2)) * 0.7;

	const fillPercentage = {
		width: props.percentage + '%',
		backgroundColor: props.color,
		borderRadius: borders,
		minHeight: height + 'em'
	};

	return (
		<div className="bar">
			<div className="filled" style={fillPercentage} />
		</div>
	);
}

export default PercentBar;
