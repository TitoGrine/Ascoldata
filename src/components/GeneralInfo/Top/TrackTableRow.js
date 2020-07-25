import React from 'react';
import { Link } from 'react-router-dom';

function TrackTableRow(props) {

    const formatDuration = (duration_ms) => {

         let seconds = Math.round(duration_ms / 1000);
         let minutes = Math.floor(seconds / 60);

        return ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2);
    }

	return (
		<tr>
			<td><Link to={ '/track?id=' + props.info.id } style={ linkStyle }>{props.info.name}</Link></td>
			<td>{props.info.album.name}</td>
			<td>
				{props.info.artists.length === 0 ? (
					'undefined'
				) : (
					props.info.artists
						.map((artist) => {
							return artist.name + ', ';
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
