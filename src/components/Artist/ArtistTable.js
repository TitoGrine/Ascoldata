import React from 'react';

import ArtistTableRow from './ArtistTableRow';

function ArtistTable(props) {
	const maxHeight = {
		maxHeight: props.maxHeight ? `${props.maxHeight}%` : '100%'
	};

	return (
		<table style={maxHeight}>
			<thead>
				<tr>
					<th>Artist</th>
					<th>Followers</th>
					<th>Genre</th>
					<th>Popularity</th>
				</tr>
			</thead>
			<tbody>
				{props.results.map((result) => {
					return <ArtistTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default ArtistTable;
