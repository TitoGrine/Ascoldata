import React from 'react';
import PlaylistTableRow from './PlaylistTableRow';
import { usePromiseTracker } from 'react-promise-tracker';

function PlaylistTable(props) {
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
				</React.Fragment>
			)}
		</table>
	);
}

export default PlaylistTable;
