import React, { useEffect, useState } from 'react';
import '../styles/weather-chart.scss';

import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const WeatherChart: React.FC<{ weatherData: any }> = ({ weatherData }) => {
  const [chartData, setChartData] = useState({});
  const [hours, setHours] = useState([0, 0, 0, 0, 0, 0, 0]);

  let data = [] as any;

  if (window.innerWidth > 420) {
    data = [
      weatherData.tempIn3H,
      weatherData.tempIn6H,
      weatherData.tempIn9H,
      weatherData.tempIn12H,
      weatherData.tempIn15H,
      weatherData.tempIn18H,
      weatherData.tempIn21H,
    ];
  } else {
    data = [
      weatherData.tempIn3H,
      weatherData.tempIn6H,
      weatherData.tempIn9H,
      weatherData.tempIn12H,
      weatherData.tempIn15H,
    ];
  }

  const countHours = () => {
    let date = new Date();
    const hourBase = date.getHours();
    const hoursArray = [] as any;

    let number = 7;
    if (window.innerWidth < 420) {
      number = 5;
    }
    for (let i = 1; i <= number; i++) {
      let hour: any = hourBase + i * 3;
      if (hour >= 24) {
        hour -= 24;
      }
      hour += ':00';
      hoursArray.push(hour);
    }
    setHours(hoursArray);
  };

  const chart = async () => {
    setChartData({
      labels: hours,
      datasets: [
        {
          label: 'Temperatura',
          data: data,
          backgroundColor: ['transparent'],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 4,
        },
      ],
    });
  };

  useEffect(() => {
    countHours();
    chart();
  }, [weatherData]);

  return (
    <div className='weather-chart'>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
            labels: {
              fontSize: 20,
            },
          },
          tooltips: {
            intersect: false,
            displayColors: false,
            callbacks: {
              label: (tooltipItem) => {
                return `Temperatura: ${
                  tooltipItem.value + String.fromCharCode(176)
                }`;
              },
            },
          },
          layout: {
            padding: {
              top: 40,
              right: 10,
              left: 10,
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                  precision: 1,
                  stepSize: 5,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  precision: 1,
                  stepSize: 1,
                  fontSize: 14,
                  fontStyle: 'bold',
                  fontColor: 'rgba(255, 255, 255, 0.6)',
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              font: {
                size: 14,
                weight: 'bold',
              },
              align: 'top',
              formatter: function (value) {
                return Math.round(value) + String.fromCharCode(176);
              },
            },
          },
        }}
      />
    </div>
  );
};

export default WeatherChart;
