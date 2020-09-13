import React from 'react';
import { Link } from 'react-router-dom';

function PlaylistTableRow(props) {
	return (
		<tr>
			<td>
				<Link to={`/playlist?id=${props.info.id}`} className="inner-link">
					{props.info.name.length > 60 ? `${props.info.name.slice(0, 60)}...` : props.info.name}
				</Link>
			</td>
			<td>
				{props.info.owner.display_name.length > 60 ? (
					`${props.info.owner.display_name.slice(0, 60)}...`
				) : (
					props.info.owner.display_name
				)}
			</td>
			<td>{props.info.public !== false ? 'Yes' : 'No'}</td>
			<td>{props.info.tracks.total}</td>
		</tr>
	);
}

export default PlaylistTableRow;
