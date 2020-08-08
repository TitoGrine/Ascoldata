import React from 'react';

import PlaylistCard from './PlaylistCard';

function PlaylistCards(props) {
	return (
		<section id="cards">
			{props.results.map((result, index) => {
				return <PlaylistCard key={result.id} index={index} info={result} />;
			})}
		</section>
	);
}

export default PlaylistCards;
