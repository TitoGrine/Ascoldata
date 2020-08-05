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
		<div className="side-toggle" onClick={toggleButton}>
			{renderIcon()}
		</div>
	);
}

const optionsStyle = {
	position: 'fixed',
	fontSize: '50px',
	color: '#191414',
	backgroundColor: 'antiquewhite'
};

const closeStyle = {
	position: 'fixed',
	fontSize: '50px',
	color: 'antiquewhite',
	backgroundColor: '#191414'
};

export default SideToggle;
