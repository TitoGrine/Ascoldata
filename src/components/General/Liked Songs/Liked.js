import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';

import { refreshToken } from '../../Auth/Auth';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import Search from '../Search/Search';
import SideToggle from '../../SideToggle';
import TrackCards from '../Track/TrackCards';

const spotifyWebApi = new Spotify();

function Liked() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const [ toggled, setToggled ] = useState('nothing');
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ userLiked, setUserLiked ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi
			.getMySavedTracks({
				limit: limit,
				offset: offset
			})
			.then(
				function(data) {
					//console.log(data);
					setUserLiked(data.items);
					setTotalItems(data.total);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();
				}
			);
	};

	const switchPage = (ev) => {
		if (Number.isInteger(ev)) {
			setOffset(limit * (ev - 1));
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
				setPage(1 + offset / limit);
			}
		},
		[ offset ]
	);

	useEffect(
		() => {
			history.push(`/liked?page=${page}`);
		},
		[ page ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					{userLiked.length > 0 &&
						(colapseTable ? <TrackCards results={userLiked} /> : <TrackTable results={userLiked} />)}
					<div className="pagination-divider" />
					<Pagination
						activePage={page}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={decreasePagination ? 3 : 8}
						onChange={switchPage}
					/>
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
						<TabList>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="liked" />
						</TabPanel>
					</Tabs>
				</div>
				<SideToggle
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default Liked;
