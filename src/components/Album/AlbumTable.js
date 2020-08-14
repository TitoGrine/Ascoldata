import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

import AlbumTableRow from './AlbumTableRow';

function AlbumTable(props) {
	const { promiseInProgress } = usePromiseTracker();

	const maxHeight = {
		maxHeight: props.maxHeight ? `${props.maxHeight}%` : '100%'
	};

	return (
		<table style={maxHeight}>
			{!promiseInProgress && (
				<React.Fragment>
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
				</React.Fragment>
			)}
		</table>
	);
}

export default AlbumTable;
