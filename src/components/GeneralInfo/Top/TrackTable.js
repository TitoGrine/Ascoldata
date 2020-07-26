import React from 'react';

import TrackTableRow from './TrackTableRow';

function TrackTable(props) {
	return (
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Album</th>
					<th>Artist</th>
					<th>Duration</th>
					<th>Popularity</th>
				</tr>
			</thead>
			<tbody>
				{props.topResults.map((result) => {
					return <TrackTableRow info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default TrackTable;