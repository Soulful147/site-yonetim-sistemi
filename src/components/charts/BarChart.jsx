import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ data, title }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Talep Sayısı',
                data: data.values,
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary,
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'var(--color-bg-tertiary)',
                titleColor: 'var(--color-text-primary)',
                bodyColor: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
                borderWidth: 1,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    color: 'var(--color-border)',
                },
                ticks: {
                    color: 'var(--color-text-secondary)',
                },
            },
            y: {
                grid: {
                    color: 'var(--color-border)',
                },
                ticks: {
                    color: 'var(--color-text-secondary)',
                    stepSize: 1,
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ height: '300px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;
