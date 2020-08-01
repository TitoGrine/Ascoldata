import React from 'react';
import './AttributeSlider.css';

function AttributeSlider(props) {

	let value = isNaN(props.value) ? '' : props.value;

	const ignoredStyle = {
		opacity: 1.3 + value
	};

	const renderInput = () => {
		if (props.value === -1)
			return (
				<label className="slider-value" style={ignoredStyle}>
					Any
				</label>
			);
		else return <input className="slider-value" type="number" min={props.min_value} max={props.max_value} value={value} onChange={props.handler}/>;
	};

	return (
		<div className="slider">
			<label className="toggle-label">
				<input
					type="checkbox"
					id="scales"
					name="scales"
					checked={props.value !== -1}
					onChange={() => {
						props.toggle(props.name);
					}}
				/>
				<span className="toggle" />
			</label>
			<label className="slider-name">{props.name}</label>
			{ renderInput() }
			<input
				className="slider-input"
				name={props.name}
				type="range"
				min={props.min_value}
				max={props.max_value}
				value={value}
				onChange={props.handler}
				step={props.step}
				style={ignoredStyle}
			/>
		</div>
	);
}

export default AttributeSlider;
