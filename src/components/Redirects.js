import React from 'react';
import { Link } from 'react-router-dom';

function Redirects(props) {
	const getRedirects = () => {
		return (
			<React.Fragment>
				{props.exclude !== 'user' && (
					<li>
						{' '}
						<Link to="/">User</Link>{' '}
					</li>
				)}
                {props.exclude !== 'top' && (
					<li>
						{' '}
						<Link to="/top?type=track&time_range=short_term">Top</Link>{' '}
					</li>
				)}
                {props.exclude !== 'statistics' && (
					<li>
						{' '}
						<Link to="/stats">Statistics</Link>{' '}
					</li>
				)}
			</React.Fragment>
		);
	};

	return <ul className="redirects">{getRedirects()}</ul>;
}

export default Redirects;
