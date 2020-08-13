import React from 'react';
import PlaylistTableRow from './PlaylistTableRow';

function PlaylistTable(props) {
	const maxHeight = {
		maxHeight: props.maxHeight ? `${props.maxHeight}%` : '100%'
	};

	return (
		<table style={maxHeight}>
			<thead>
				<tr>
					<th>Playlist</th>
					<th>Owner</th>
					<th>Public</th>
					<th>Collaborative</th>
					<th>Nr. Songs</th>
				</tr>
			</thead>
			<tbody>
				{props.results.map((result) => {
					return <PlaylistTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default PlaylistTable;
