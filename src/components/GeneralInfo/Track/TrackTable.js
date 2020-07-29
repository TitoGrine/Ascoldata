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
					if(result.added_at)
						return <TrackTableRow key={result.track.id} info={result.track} />;
					else 
						return <TrackTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default TrackTable;
