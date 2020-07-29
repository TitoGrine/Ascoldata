import React from 'react';

import ArtistTableRow from './ArtistTableRow';

function ArtistTable(props) {
	return (
		<table>
			<thead>
				<tr>
					<th>Artist</th>
					<th>Followers</th>
					<th>Genre</th>
					<th>Popularity</th>
				</tr>
			</thead>
			<tbody>
				{props.topResults.map((result) => {
					return <ArtistTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default ArtistTable;
