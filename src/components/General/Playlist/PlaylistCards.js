import React from 'react';

import PlaylistCard from './PlaylistCard';

function PlaylistCards(props) {
	return (
		<section id="cards">
			{props.results.map((result) => {
				return <PlaylistCard key={result.id} info={result} />;
			})}
		</section>
	);
}

export default PlaylistCards;
