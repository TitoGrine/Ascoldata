import React, { useState } from 'react';
import { IoIosOptions, IoIosClose } from 'react-icons/io';

function SideToggle(props) {
	const [ toggle, setToggle ] = useState(false);

	const toggleButton = () => {
		props.toggleFunc(toggle ? 'closed' : 'toggled');
		setToggle(!toggle);
	};

	const renderIcon = () => {
		return toggle ? <IoIosClose style={closeStyle} /> : <IoIosOptions style={optionsStyle} />;
	};

	return (
		<button className="side-toggle" onClick={toggleButton}>
			{renderIcon()}
		</button>
	);
}

const optionsStyle = {
	fontSize: '50px',
	color: '#191414',
	backgroundColor: 'antiquewhite'
};

const closeStyle = {
	fontSize: '50px',
	color: 'antiquewhite',
	backgroundColor: '#191414'
};

export default SideToggle;
