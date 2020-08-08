import React from 'react';

import AlbumCard from './AlbumCard';

function AlbumCards(props) {
	return (
		<section id="cards">
			{props.results.map((result, index) => {
				return <AlbumCard key={result.id} index={index} info={result} />;
			})}
		</section>
	);
}

export default AlbumCards;
