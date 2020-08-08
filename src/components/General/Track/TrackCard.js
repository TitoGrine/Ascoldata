import React from 'react';
import { Link } from 'react-router-dom';

import { formatDuration } from '../../HelperFunc';
import { Textfit } from 'react-textfit';

function TrackCard(props) {
	return (
		<div className="card">
			<div>
				<strong>Title: </strong>
				<Link to={'/track?id=' + props.info.id} className="inner-link">
					<Textfit mode="multi" min={14} max={17}>
						{props.info.name}
					</Textfit>
				</Link>
			</div>
			<div>
				<strong>Album: </strong>
				<Link to={'/album?id=' + props.info.album.id} className="inner-link">
					{props.info.album.name}
				</Link>
			</div>
			<div className="track-artists">
				<strong>{`Artist${props.info.artists.length > 1 ? 's' : ''}:`}</strong>
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
			<div>
				<strong>Duration: </strong>
				{formatDuration(props.info.duration_ms)}
			</div>
			<div>
				<strong>Popularity: </strong>
				{props.info.popularity}
			</div>
		</div>
	);
}

export default TrackCard;
