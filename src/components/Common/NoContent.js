import React from 'react';

function NoContent(props) {
	return (
		<div className="no-content-warning">
			<strong>{props.mainText}</strong>
			{props.mainText ? <p>{props.secondaryText}</p> : ''}
		</div>
	);
}

export default NoContent;
