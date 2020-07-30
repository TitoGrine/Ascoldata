import React from 'react'

function PercentBar(props) {

    const borders = props.percentage < 99 ? '2em 0 0 2em' : '2em' 

    const fillPercentage = {
        width: props.percentage + '%',
        backgroundColor: props.color,
        borderRadius: borders
    }

    return (
        <div className="bar">
            <div className="filled" style={ fillPercentage }></div>
        </div>
    )
}

export default PercentBar
