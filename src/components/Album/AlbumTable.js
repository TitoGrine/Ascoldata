import React from 'react';

import AlbumTableRow from './AlbumTableRow';

function AlbumTable(props) {
    return (
        <table>
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
    )
}

export default AlbumTable
