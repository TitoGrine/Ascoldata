import React from 'react';

import ArtistCard from './ArtistCard';

function ArtistCards(props) {
	return (
		<section id="cards">
			{props.results.map((result) => {
				return <ArtistCard key={result.id} info={result} />;
			})}
		</section>
	);
}

export default ArtistCards;
