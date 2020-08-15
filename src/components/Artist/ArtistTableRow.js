import React from 'react';
import { Link } from 'react-router-dom';

function ArtistTableRow(props) {
	return (
		<tr>
			<td>
				<Link to={'/artist?id=' + props.info.id} className="inner-link">
					{props.info.name}
				</Link>
			</td>
			<td>{props.info.followers.total}</td>
			<td>
				{props.info.genres.length === 0 ? (
					'undefined'
				) : (
					props.info.genres.slice(0, 2).map((genre, index) => {
						return (
							genre.charAt(0).toUpperCase() +
							genre.slice(1) +
							(index === props.info.genres.length - 1 || index ? '' : ', ')
						);
					})
				)}
			</td>
			<td>{props.info.popularity}</td>
		</tr>
	);
}

export default ArtistTableRow;
