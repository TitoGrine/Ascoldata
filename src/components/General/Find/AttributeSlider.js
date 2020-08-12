import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { getExplanation } from '../../HelperFunc';

function AttributeSlider(props) {
	const value = isNaN(props.value) ? '' : props.value;

	const renderInput = () => {
		if (props.value === -1) return <label className="slider-value attribute-disabled">Any</label>;
		else
			return (
				<input
					className="slider-value attribute-enabled"
					type="number"
					min={props.min_value}
					max={props.max_value}
					value={value}
					onChange={props.handler}
				/>
			);
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
			<OverlayTrigger key="top" placement="top" overlay={<Tooltip>{getExplanation(props.explanation)}</Tooltip>}>
				<label className="slider-name">{props.name}</label>
			</OverlayTrigger>
			{renderInput()}
			<input
				className={`slider-input attribute-${props.value === -1 ? 'disabled' : 'enabled'}`}
				name={props.name}
				type="range"
				min={props.min_value}
				max={props.max_value}
				value={value}
				onChange={props.handler}
				step={props.step}
			/>
		</div>
	);
}

export default AttributeSlider;
