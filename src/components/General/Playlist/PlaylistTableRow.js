import React from 'react';
import { Link } from 'react-router-dom';

function PlaylistTableRow(props) {
    return (
        <tr>
			<td><Link to={ '/playlist?id=' + props.info.id } style={ linkStyle }>{props.info.name}</Link></td>
			<td>{props.info.public ? 'Yes' : 'No'}</td>
			<td>{props.info.collaborative ? 'Yes' : 'No'}
			</td>
			<td>{props.info.tracks.total}</td>
		</tr>
    )
}

const linkStyle = {
	color: '#1db954'
}

export default PlaylistTableRow
