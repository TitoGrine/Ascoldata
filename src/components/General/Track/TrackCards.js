import React from 'react';

import TrackCard from './TrackCard';

function TrackCards(props) {
	return (
		<section id="cards">
			{props.results.map((result) => {
				if (result.added_at) return <TrackCard key={result.track.id} info={result.track} />;
				else return <TrackCard key={result.id} info={result} />;
			})}
		</section>
	);
}

export default TrackCards;
