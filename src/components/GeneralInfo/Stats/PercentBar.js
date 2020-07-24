import React from 'react'

function PercentBar(props) {

    const fillPercentage = {
        width: props.percentage + '%',
        backgroundColor: props.color
    }

    return (
        <div className="bar">
            <div className="filled" style={ fillPercentage }>
            { props.percentage }
            </div>
        </div>
    )
}

export default PercentBar
