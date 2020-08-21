import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { formatDuration } from '../Util/HelperFunc';

export class TrackCard extends Component {
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
					<strong>Title: </strong>
					<Link to={`/track?id=${this.props.info.id}`} className="inner-link">
						{this.props.info.name}
					</Link>
				</div>
				<div>
					<strong>Album: </strong>
					<Link to={`/album?id=${this.props.info.album.id}`} className="inner-link">
						{this.props.info.album.name}
					</Link>
				</div>
				<div className="enum-artists">
					<strong>{`Artist${this.props.info.artists.length > 1 ? 's' : ''}:`}</strong>
					{this.props.info.artists.length === 0 ? (
						'undefined'
					) : (
						this.props.info.artists
							.map((artist) => {
								return (
									<Link key={artist.id} to={`/artist?id=${artist.id}`} className="inner-link">
										{artist.name}
									</Link>
								);
							})
							.slice(0, 2)
					)}
				</div>
				<div>
					<strong>Duration: </strong>
					{formatDuration(this.props.info.duration_ms)}
				</div>
				<div>
					<strong>Popularity: </strong>
					{this.props.info.popularity}
				</div>
			</div>
		);
	}
}

export default TrackCard;
