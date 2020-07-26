import React from 'react';
import { Link } from 'react-router-dom';

function ArtistTableRow(props) {
	return (
		<tr>
			<td><Link to={ '/artist?id=' + props.info.id } style={ linkStyle }>{props.info.name}</Link></td>
			<td>{props.info.followers.total}</td>
			<td>
				{props.info.genres.length === 0 ? (
					'undefined'
				) : (
					props.info.genres
						.map((genre) => {
							return genre + ', ';
						})
						.slice(0, 2)
				)}
			</td>
			<td>{props.info.popularity}</td>
		</tr>
	);
}

const linkStyle = {
	color: '#1db954'
}

export default ArtistTableRow;