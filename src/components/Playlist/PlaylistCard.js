import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { MdDone, MdBlock } from 'react-icons/md';

export class PlaylistCard extends Component {
	constructor(props) {
		super(props);
		this.scrollStart = React.createRef();
	}

	componentDidMount() {
		if (this.props.index === 0) this.scrollStart.current.scrollIntoView();
	}

	render() {
		return (
			<div className="card" ref={this.scrollStart}>
				<div>
					<strong>Playlist: </strong>
					<Link to={`/playlist?id=${this.props.info.id}`} className="inner-link">
						{this.props.info.name}
					</Link>
				</div>
				<div>
					<strong>Owner: </strong>
					{this.props.info.owner.display_name}
				</div>
				<div>
					<strong>Public: </strong>
					{this.props.info.public ? <MdDone style={checkStyle} /> : <MdBlock style={blockStyle} />}
				</div>
				<div>
					<strong>Nr. Songs: </strong>
					{this.props.info.tracks.total}
				</div>
			</div>
		);
	}
}

const checkStyle = {
	color: 'green'
};

const blockStyle = {
	color: 'red'
};

export default PlaylistCard;
