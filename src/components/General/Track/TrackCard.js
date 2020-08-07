import React from 'react';
import { Link } from 'react-router-dom';

import { formatDuration } from '../../HelperFunc';

function TrackCard(props) {
	return (
		<div className="card">
			<div>
				Title:{' '}
				<Link to={'/track?id=' + props.info.id} className="inner-link">
					{props.info.name}
				</Link>
			</div>
			<div>
				Album:{' '}
				<Link to={'/album?id=' + props.info.album.id} className="inner-link">
					{props.info.album.name}
				</Link>
			</div>
			<div className="track-artists">
				Artist:{' '}
				{props.info.artists.length === 0 ? (
					'undefined'
				) : (
					props.info.artists
						.map((artist) => {
							return (
								<Link key={artist.id} to={'/artist?id=' + artist.id} className="inner-link">
									{artist.name}
								</Link>
							);
						})
						.slice(0, 2)
				)}
			</div>
			<div>Duration:  {formatDuration(props.info.duration_ms)}</div>
			<div>Popularity:  {props.info.popularity}</div>
		</div>
	);
}

export default TrackCard;
