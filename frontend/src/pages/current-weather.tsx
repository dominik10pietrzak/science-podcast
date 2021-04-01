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
      <div className='temp'>
        <img
          className='weather-image'
          src={
            require(`../assets/weather-images/${weatherData.description}.svg`)
              .default
          }
          alt='weather'
        />
        <h1 className='temperature'>
          {Math.round(weatherData.currentTemp)}&#176;
        </h1>
      </div>
      <div className='weather-info'>
        <div className='location'>
          <span className='date'>
            {translateDescription(weatherData.description)}
          </span>
          {/* <span className='date'>
            {date.dayOfWeek}, {date.dayOfMonth} {date.month}
          </span> */}
          <h3 className='city-name'>
            <i className='fas fa-map-marker-alt'></i>
            {weatherData.city}
            {weatherData.country !== '' ? ', ' + weatherData.country : ''}
          </h3>
        </div>
        {/* <div className='description'>
          <img
            className='weather-image'
            src={
              require(`../assets/weather-images/${weatherData.description}.svg`)
                .default
            }
            alt='weather'
          />
          <span>{translateDescription(weatherData.description)}</span>
        </div> */}
      </div>
      {/* <div className='description'>
        <span>Wilgotność: {weatherData.humidity}% </span>
        <span>Wiatr: {Math.round(weatherData.windSpeed)} km/h</span>
      </div> */}
    </div>
  );
};

export default CurrentWeather;
