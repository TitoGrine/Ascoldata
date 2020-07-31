import React from 'react';
import './AttributeSlider.css';

function AttributeSlider(props) {
	const ignoredStyle = {
		opacity: 1.2 + props.value
	};

	return (
		<div className="slider">
			<div>
				<label className="slider-name">{props.name}</label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        id="scales"
                        name="scales"
                        checked={props.value !== -1}
                        onChange={() => {
                            props.toggle(props.name);
                        }}
                    />
                    <span className="checkmark"></span>
                </label>
				
			</div>
			<label className="slider-value" style={ignoredStyle}>
				{props.value === -1 ? 'Any' : props.value}
			</label>
			<input
				className="slider-input"
				name={props.name}
				type="range"
				min={0}
				max={1}
				value={props.value}
				onChange={props.handler}
				step="0.01"
				style={ignoredStyle}
			/>
		</div>
	);
}

export default AttributeSlider;
