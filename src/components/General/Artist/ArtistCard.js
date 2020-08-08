import React from 'react';
import { Link } from 'react-router-dom';

function ArtistCard(props) {
	return (
		<div className="card">
			<div>
				<strong>Artist: </strong>
				<Link to={'/artist?id=' + props.info.id} className="inner-link">
					{props.info.name}
				</Link>
			</div>
			<div>
				<strong>Followers: </strong>
				{props.info.followers.total}
			</div>
			<div>
				<strong>{`Genre${props.info.genres.length > 1 ? 's' : ''}:`}</strong>
				{props.info.genres.length === 0 ? (
					'undefined'
				) : (
					props.info.genres
						.map((genre, index) => {
							return genre + (index === props.info.genres.length - 1 || index === 1 ? '' : ',');
						})
						.slice(0, 2)
				)}
			</div>
			<div>
				<strong>Popularity: </strong>
				{props.info.popularity}
			</div>
		</div>
	);
}

export default ArtistCard;
