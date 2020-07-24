import React from 'react'
import PercentBar from './PercentBar'

function StatCard(props) {
    console.log(props);

    return (
        <div className="stat-card">
            { props.title }
            <PercentBar percentage={ props.percentage } color={ props.color }/>
        </div>
    )
}

export default StatCard
