import React from 'react';

import AlbumCard from './AlbumCard';

function AlbumCards(props) {
	return (
		<section id="cards">
			{props.results.map((result) => {
				return <AlbumCard key={result.id} info={result} />;
			})}
		</section>
	);
}

export default AlbumCards;
