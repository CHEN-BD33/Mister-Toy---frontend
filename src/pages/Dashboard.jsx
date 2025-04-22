import { useEffect, useState } from 'react'
// import { Chart } from '../cmps/Chart.jsx'
import { toyService } from '../services/toy.service.js'
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export function Dashboard() {

    const [toys, setToys] = useState([])
    const [priceStats, setPriceStats] = useState([])
    console.log('priceStats:', priceStats)

    useEffect(() => {
        toyService.query()
            .then(setToys)

        toyService.getPriceStats()
            .then(setPriceStats)
    }, [])

    const data = {
        labels: priceStats.map(s => s.title),
        datasets: [
            {
                label: '# of Votes',
                data: priceStats.map(s => s.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },

        ],
    };


    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {toys.length} Toys</h2>
            <h4>By Price</h4>
            <Pie data={data} />

        </section>
    )
}