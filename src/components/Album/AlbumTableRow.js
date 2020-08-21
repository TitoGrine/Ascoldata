import React from 'react';
import { Link } from 'react-router-dom';

function AlbumTableRow(props) {
	return (
		<tr>
			<td>
				<Link to={`/album?id=${props.info.id}`} className="inner-link">
					{props.info.name}
				</Link>
			</td>
			<td className="enum-artists">
				{props.info.artists.length === 0 ? (
					'undefined'
				) : (
					props.info.artists
						.map((artist) => {
							return (
								<Link key={artist.id} to={`/artist?id=${artist.id}`} className="inner-link">
									{artist.name}
								</Link>
							);
						})
						.slice(0, 2)
				)}
			</td>
			<td>{props.info.release_date}</td>
			<td>{props.info.total_tracks}</td>
		</tr>
	);
}

export default AlbumTableRow;
