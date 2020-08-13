import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class ArtistCard extends Component {
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
					<strong>Artist: </strong>
					<Link to={'/artist?id=' + this.props.info.id} className="inner-link">
						{this.props.info.name}
					</Link>
				</div>
				<div>
					<strong>Followers: </strong>
					{this.props.info.followers.total}
				</div>
				<div>
					<strong>{`Genre${this.props.info.genres.length > 1 ? 's' : ''}:`}</strong>
					{this.props.info.genres.length === 0 ? (
						'undefined'
					) : (
						this.props.info.genres
							.map((genre, index) => {
								return genre + (index === this.props.info.genres.length - 1 || index === 1 ? '' : ',');
							})
							.slice(0, 2)
					)}
				</div>
				<div>
					<strong>Popularity: </strong>
					{this.props.info.popularity}
				</div>
			</div>
		);
	}
}

export default ArtistCard;
