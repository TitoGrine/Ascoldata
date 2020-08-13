import React from 'react';

import AlbumTableRow from './AlbumTableRow';

function AlbumTable(props) {
	const maxHeight = {
		maxHeight: props.maxHeight ? `${props.maxHeight}%` : '100%'
	};

	return (
		<table style={maxHeight}>
			<thead>
				<tr>
					<th>Album</th>
					<th>Artist</th>
					<th>Release Date</th>
					<th>Nr. Songs</th>
				</tr>
			</thead>
			<tbody>
				{props.results.map((result) => {
					return <AlbumTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default AlbumTable;
