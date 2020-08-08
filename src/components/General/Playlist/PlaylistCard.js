import React from 'react';
import { Link } from 'react-router-dom';

import { MdDone, MdBlock } from 'react-icons/md';

function PlaylistCard(props) {
	console.log(props.info);

	return (
		<div className="card">
			<div>
				<strong>Playlist: </strong>
				<Link to={'/playlist?id=' + props.info.id} className="inner-link">
					{props.info.name}
				</Link>
			</div>
			<div>
				<strong>Owner: </strong>
				{props.info.owner.display_name}
			</div>
			<div>
				<strong>Public: </strong>
				{props.info.public ? <MdDone style={checkStyle} /> : <MdBlock style={blockStyle} />}
			</div>
			<div>
				<strong>Collaborative: </strong>
				{props.info.collaborative ? <MdDone style={checkStyle} /> : <MdBlock style={blockStyle} />}
			</div>
			<div>
				<strong>Nr. Songs: </strong>
				{props.info.tracks.total}
			</div>
		</div>
	);
}

const checkStyle = {
	color: 'green'
};

const blockStyle = {
	color: 'red'
};

export default PlaylistCard;
