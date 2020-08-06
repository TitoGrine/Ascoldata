import React from 'react';
import { Link } from 'react-router-dom';

function Redirects(props) {
	const getRedirects = () => {
		return (
			<React.Fragment>
				{props.exclude !== 'user' && (
					<li>
						<Link to="/">User</Link>
					</li>
				)}
				{props.exclude !== 'top' && (
					<li>
						<Link to={`/top?type=track&time_range=short_term&page=${1}`}>Top</Link>
					</li>
				)}
				{props.exclude !== 'statistics' && (
					<li>
						<Link to="/stats">Statistics</Link>
					</li>
				)}
				{props.exclude !== 'liked' && (
					<li>
						<Link to={`/liked?page=${1}`}>Liked</Link>
					</li>
				)}
				{props.exclude !== 'playlists' && (
					<li>
						<Link to={`/playlists?page=${1}`}>Playlists</Link>
					</li>
				)}
				{props.exclude !== 'find' && (
					<li>
						<Link to={`/find`}>Find</Link>
					</li>
				)}
			</React.Fragment>
		);
	};

	return <ul className="redirects">{getRedirects()}</ul>;
}

export default Redirects;
