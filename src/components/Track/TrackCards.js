import React from 'react';

import TrackCard from './TrackCard';

function TrackCards(props) {
	return (
		<section id="cards">
			{props.results.map((result, index) => {
				if (result.added_at) return <TrackCard key={result.track.id} index={index} info={result.track} />;
				else return <TrackCard key={result.id} index={index} info={result} />;
			})}
		</section>
	);
}

export default TrackCards;
