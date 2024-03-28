"use client"

import { parseDataByKey } from "../utils/utils"
import { useState, useEffect, useMemo } from "react";

import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

export const ChartComponent = ({isHeartRateVisible,isSpO2Visible,data}) => {
    const heartData = useMemo(() => parseDataByKey(data, "heart"), [data]);
    const o2Data = useMemo(() => parseDataByKey(data, "o2"), [data]);
    
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Heart Rate',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
                hidden: !isHeartRateVisible, // Use hidden property instead of removing datasets
            },
            {
                label: 'Oxygen Level',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y',
                hidden: !isSpO2Visible, // Use hidden property instead of removing datasets
                fill: true,
            },
        ],
    });

    useEffect(() => {
        setChartData(prevData => ({
            ...prevData,
            labels: o2Data.map(data => new Date(data.time).toLocaleString()),
            datasets: prevData.datasets.map(dataset => {
                if (dataset.label === 'Heart Rate') {
                    return { ...dataset, data: heartData.map(data => data.value), hidden: !isHeartRateVisible };
                } else if (dataset.label === 'Oxygen Level') {
                    return { ...dataset, data: o2Data.map(data => data.value), hidden: !isSpO2Visible };
                }
                return dataset;
            }),
        }));
    }, [data, isHeartRateVisible, isSpO2Visible]);

    return (
        <div className="w-full bg-blue-100 text-black rounded-xl h-full">
           <Line 
           data={chartData} 
           options={{
            maintainAspectRatio: false,
            scales: { 
                y: { beginAtZero: true }, 
                x: { 
                    display: false,
                }
    
            },
            // animation: false, // Disable animations
          }} />
        </div>
    )
}