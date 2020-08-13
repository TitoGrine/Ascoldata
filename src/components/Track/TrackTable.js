import React from 'react';

import TrackTableRow from './TrackTableRow';

function TrackTable(props) {
	const maxHeight = {
		maxHeight: props.maxHeight ? `${props.maxHeight}%` : '100%'
	};

	return (
		<table style={maxHeight}>
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
				{props.results.map((result) => {
					if (result.added_at) return <TrackTableRow key={result.track.id} info={result.track} />;
					else return <TrackTableRow key={result.id} info={result} />;
				})}
			</tbody>
		</table>
	);
}

export default TrackTable;
