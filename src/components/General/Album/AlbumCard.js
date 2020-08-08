import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class AlbumCard extends Component {
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
					<strong>Album: </strong>
					<Link to={'/album?id=' + this.props.info.id} className="inner-link">
						{this.props.info.name}
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
									<Link key={artist.id} to={'/artist?id=' + artist.id} className="inner-link">
										{artist.name}
									</Link>
								);
							})
							.slice(0, 2)
					)}
				</div>
				<div>
					<strong>Release Date: </strong>
					{this.props.info.release_date}
				</div>
				<div>
					<strong>Nr. Songs: </strong>
					{this.props.info.total_tracks}
				</div>
			</div>
		);
	}
}

export default AlbumCard;
