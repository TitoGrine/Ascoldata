import React from 'react';

import TableRow from './TableRow';

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
					return <TableRow info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default ArtistTable;
