import React from 'react';
import { Link } from 'react-router-dom';

import { formatDuration } from '../Util/HelperFunc';

function TrackTableRow(props) {
	return (
		<tr>
			<td>
				<Link to={`/track?id=${props.info.id}`} className="inner-link">
					{props.info.name.length > 60 ? `${props.info.name.slice(0, 60)}...` : props.info.name}
				</Link>
			</td>
			<td>
				<Link to={`/album?id=${props.info.album.id}`} className="inner-link">
					{props.info.album.name.length > 60 ? (
						`${props.info.album.name.slice(0, 60)}...`
					) : (
						props.info.album.name
					)}
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
									{artist.name.length > 40 ? `${artist.name.slice(0, 40)}...` : artist.name}
								</Link>
							);
						})
						.slice(0, 2)
				)}
			</td>
			<td>{formatDuration(props.info.duration_ms)}</td>
			<td>{props.info.popularity}</td>
		</tr>
	);
}

export default TrackTableRow;
