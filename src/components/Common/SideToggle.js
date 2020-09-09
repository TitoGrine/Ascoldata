import React, { useState } from 'react';
import { IoIosOptions, IoIosClose } from 'react-icons/io';

const SideToggle = React.forwardRef((props, ref) => {
	const [ toggle, setToggle ] = useState(false);

	const toggleButton = () => {
		props.toggleFunc(toggle ? 'closed' : 'toggled');
		setToggle(!toggle);
	};

	const renderIcon = () => {
		return toggle ? <IoIosClose style={closeStyle} /> : <IoIosOptions style={optionsStyle} />;
	};

	return (
		<button className="side-toggle" ref={ref} onClick={() => toggleButton()}>
			{renderIcon()}
		</button>
	);
});

const optionsStyle = {
	fontSize: '50px',
	color: 'var(--color-neutral)',
	backgroundColor: 'var(--color-secondary)'
};

const closeStyle = {
	fontSize: '50px',
	color: 'var(--color-secondary)',
	backgroundColor: 'var(--color-neutral)'
};

export default SideToggle;
