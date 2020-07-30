import React, { useState } from 'react';
import './Search.css';

function Search() {
	const [ searchType, setSearchType ] = useState('album');

	const updateSearch = (ev) => {
		console.log(ev.target.value);
		setSearchType(ev.target.value);
	};

	return (
		<div id="search-settings">
			<form action="/search">
				<div id="search-bar">
					<input type="text" name="q" placeholder={`Search for ${searchType}..`} />
					<button className="search-button"> Search </button>
				</div>
				<p> Looking for: </p>
				<div className="query-type-labels">
					<label>
						<input
							id="album"
							type="radio"
							name="type"
							value="album"
							checked={searchType.localeCompare('album') === 0}
							onChange={updateSearch}
						/>
						<span className="checkmark" />
						Albums
					</label>
					<label>
						<input
							id="artist"
							type="radio"
							name="type"
							value="artist"
							checked={searchType.localeCompare('artist') === 0}
							onChange={updateSearch}
						/>
						<span className="checkmark" />
						Artists
					</label>
					<label>
						<input
							id="playlist"
							type="radio"
							name="type"
							value="playlist"
							checked={searchType.localeCompare('playlist') === 0}
							onChange={updateSearch}
						/>
						<span className="checkmark" />
						Playlists
					</label>
					<label>
						<input
							id="track"
							type="radio"
							name="type"
							value="track"
							checked={searchType.localeCompare('track') === 0}
							onChange={updateSearch}
						/>
						<span className="checkmark" />
						Songs
					</label>
				</div>
                <input type="number" name="page" value={1} style={{display:"none"}} readOnly/>
            </form>
		</div>
	);
}

export default Search;
