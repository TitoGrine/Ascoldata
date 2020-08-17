import React from 'react';

function RadioInput(props) {
	return (
		<label>
			<input
				id={props.id}
				type="radio"
				name={props.name}
				value={props.value}
				checked={props.checked}
				onChange={(ev) => props.onChange(ev)}
			/>
			<span className="checkmark" />
			{props.title}
		</label>
	);
}

export default RadioInput;
