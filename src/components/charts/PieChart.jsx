import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                data: data.values,
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.secondary,
                    CHART_COLORS.success,
                    CHART_COLORS.warning,
                    CHART_COLORS.danger,
                    CHART_COLORS.info,
                ],
                borderColor: 'var(--color-bg-secondary)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'var(--color-text-secondary)',
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'var(--color-bg-tertiary)',
                titleColor: 'var(--color-text-primary)',
                bodyColor: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            },
        },
    };

    return (
        <div style={{ height: '300px' }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
