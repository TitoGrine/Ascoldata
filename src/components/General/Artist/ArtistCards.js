import React from 'react';

import ArtistCard from './ArtistCard';

function ArtistCards(props) {
	return (
		<section id="cards">
			{props.results.map((result, index) => {
				return <ArtistCard key={result.id} index={index} info={result} />;
			})}
		</section>
	);
}

export default ArtistCards;
