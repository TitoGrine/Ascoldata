import React, { useState } from 'react';
import './Search.css';
import { GrSearch } from 'react-icons/gr';
import RadioInput from '../../RadioInput';

function Search() {
	const [ searchType, setSearchType ] = useState('album');

	const updateSearch = (ev) => {
		//console.log(ev.target.value);
		setSearchType(ev.target.value);
	};

	return (
		<div id="search-settings">
			<form action="/search">
				<div id="search-bar">
					<input type="text" name="q" placeholder={`Search for ${searchType}s..`} required />
					<button className="search-button" value="submit">
						<GrSearch />
					</button>
				</div>
				<p> Looking for: </p>
				<div className="query-type-labels">
					<RadioInput
						id="album"
						value="album"
						name="type"
						checked={searchType.localeCompare('album') === 0}
						onChange={updateSearch}
						title="Albums"
					/>
					<RadioInput
						id="artist"
						value="artist"
						name="type"
						checked={searchType.localeCompare('artist') === 0}
						onChange={updateSearch}
						title="Artists"
					/>
					<RadioInput
						id="playlist"
						value="playlist"
						name="type"
						checked={searchType.localeCompare('playlist') === 0}
						onChange={updateSearch}
						title="Playlists"
					/>
					<RadioInput
						id="track"
						value="track"
						name="type"
						checked={searchType.localeCompare('track') === 0}
						onChange={updateSearch}
						title="Songs"
					/>
				</div>
				<input type="number" name="page" value={1} style={{ display: 'none' }} readOnly />
			</form>
		</div>
	);
}

export default Search;
