import React from 'react';
import { Link } from 'react-router-dom';

function AlbumCard(props) {
	return (
		<div className="card">
			<div>
				<strong>Album: </strong>
				<Link to={'/album?id=' + props.info.id} className="inner-link">
					{props.info.name}
				</Link>
			</div>
			<div className="enum-artists">
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
				<strong>Release Date: </strong>
				{props.info.release_date}
			</div>
			<div>
				<strong>Nr. Songs: </strong>
				{props.info.total_tracks}
			</div>
		</div>
	);
}

export default AlbumCard;
