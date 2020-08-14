import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

import ArtistTableRow from './ArtistTableRow';

function ArtistTable(props) {
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
				</React.Fragment>
			)}
		</table>
	);
}

export default ArtistTable;
