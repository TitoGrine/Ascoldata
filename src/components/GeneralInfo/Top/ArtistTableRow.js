import React from 'react';

function ArtistTableRow(props) {
	return (
		<tr>
			<td>{props.info.name}</td>
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

export default ArtistTableRow;
