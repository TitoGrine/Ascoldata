import React from 'react';
import { Link } from 'react-router-dom';

import { formatDuration } from '../../HelperFunc';

function TrackTableRow(props) {

	return (
		<tr>
			<td><Link to={ '/track?id=' + props.info.id } style={ linkStyle }>{props.info.name}</Link></td>
			<td><Link to={ '/album?id=' + props.info.album.id } style={ linkStyle }>{props.info.album.name}</Link></td>
			<td className="track-artists">
				{props.info.artists.length === 0 ? (
					'undefined'
				) : (
					props.info.artists
						.map((artist) => {
							return <Link key={artist.id} to={ '/artist?id=' + artist.id } style={ linkStyle }>{artist.name}</Link>;
						})
						.slice(0, 2)
				)}
			</td>
            <td>{formatDuration(props.info.duration_ms)}</td>
			<td>{props.info.popularity}</td>
		</tr>
	);
}

const linkStyle = {
	color: '#1db954'
}


export default TrackTableRow;
