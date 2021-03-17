import React from 'react';
import '../styles/current-weather.scss';

import { translateDescription } from '../functions/functions';

const displayDate = () => {
  const date = new Date();
  let dayOfWeek = date.getDay();
  let dayOfMonth = date.getDate();
  let month = date.getMonth();

  const days = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];

  const months = [
    'Stycznia',
    'Lutego',
    'Marca',
    'Kwietnia',
    'Maja',
    'Czerwca',
    'Lipca',
    'Sierpnia',
    'Września',
    'Października',
    'Listopada',
    'Grudnia',
  ];

  let currentDate = {
    dayOfWeek: days[dayOfWeek],
    dayOfMonth: dayOfMonth,
    month: months[month],
  };

  return currentDate;
};

const CurrentWeather: React.FC<{
  weatherData: any;
}> = ({ weatherData }) => {
  const date = displayDate();
  return (
    <div className='current-weather'>
      <div className='left'>
        <h1 className='temperature'>
          {Math.round(weatherData.currentTemp)}&#176;
        </h1>
        <span>{translateDescription(weatherData.description)}</span>
        <div className='description'>
          <span>H: {weatherData.humidity}% </span>
          <span>W: {Math.round(weatherData.windSpeed)} km/h</span>
        </div>
      </div>
      <div className='location'>
        <h3 className='city-name'>
          {weatherData.city}
          {weatherData.country !== '' ? ', ' + weatherData.country : ''}
        </h3>
        <span className='date'>
          {date.dayOfWeek}, {date.dayOfMonth} {date.month}
        </span>
      </div>
    </div>
  );
};

export default CurrentWeather;
