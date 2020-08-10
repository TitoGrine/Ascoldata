import React from 'react';
import { Spinner } from 'react-bootstrap';
import { usePromiseTracker } from 'react-promise-tracker';

function LoadingSpinner() {
	const { promiseInProgress } = usePromiseTracker({ delay: 300 });

	return (
		promiseInProgress && (
			<Spinner animation="border" role="status" style={spinnerStyle}>
				<span className="sr-only">Loading...</span>
			</Spinner>
		)
	);
}

const spinnerStyle = {
	color: '#1db954',
	position: 'absolute',
	width: '40px',
	height: '40px',
	top: 'calc(50% - 20px)',
	left: 'calc(50% - 20px)'
};

export default LoadingSpinner;
