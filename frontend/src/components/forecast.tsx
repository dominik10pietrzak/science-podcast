import React from 'react';
import '../styles/forecast.scss';

import { translateDescription as translate } from '../functions/functions';

const displayDate = () => {
  const date = new Date();
  const day = date.getDay();

  let days = ['Niedz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];

  if (window.innerWidth > 1024) {
    days = [
      'Niedziela',
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
    ];
  }

  const daysOfWeek = [];

  let idx = day + 1;
  for (let i = 0; i < 5; i++) {
    if (idx === 7) {
      idx = 0;
      daysOfWeek.push(days[idx]);
    } else {
      daysOfWeek.push(days[idx]);
    }
    idx++;
  }
  return daysOfWeek;
};

const Forecast: React.FC<{
  weatherData: any;
}> = ({ weatherData }) => {
  const daysOfWeek = displayDate();
  return (
    <div className='forecast'>
      <div className='day-forecast'>
        <h3>{weatherData.tempIn1D}&#176;</h3>
        <img
          src={
            require(`../assets/weather-images/${weatherData.descIn1D}.svg`)
              .default
          }
          alt='1dimg'
        />
        <h3 className='day-of-week'>{daysOfWeek[0]}</h3>
        <h3 className='wind-speed'>{weatherData.windIn1D}km/h</h3>
      </div>
      <div className='day-forecast'>
        <h3>{weatherData.tempIn2D}&#176;</h3>
        <img
          src={
            require(`../assets/weather-images/${weatherData.descIn2D}.svg`)
              .default
          }
          alt='2dimg'
        />
        <h3 className='day-of-week'>{daysOfWeek[1]}</h3>
        <h3 className='wind-speed'>{weatherData.windIn2D}km/h</h3>
      </div>
      <div className='day-forecast'>
        <h3>{weatherData.tempIn3D}&#176;</h3>
        <img
          src={
            require(`../assets/weather-images/${weatherData.descIn3D}.svg`)
              .default
          }
          alt='3dimg'
        />
        <h3 className='day-of-week'>{daysOfWeek[2]}</h3>
        <h3 className='wind-speed'>{weatherData.windIn3D}km/h</h3>
      </div>
      <div className='day-forecast'>
        <h3>{weatherData.tempIn4D}&#176;</h3>
        <img
          src={
            require(`../assets/weather-images/${weatherData.descIn4D}.svg`)
              .default
          }
          alt='4dimg'
        />
        <h3 className='day-of-week'>{daysOfWeek[3]}</h3>
        <h3 className='wind-speed'>{weatherData.windIn4D}km/h</h3>
      </div>
      <div className='day-forecast'>
        <h3>{weatherData.tempIn5D}&#176;</h3>
        <img
          src={
            require(`../assets/weather-images/${weatherData.descIn5D}.svg`)
              .default
          }
          alt='5dimg'
        />
        <h3 className='day-of-week'>{daysOfWeek[4]}</h3>
        <h3 className='wind-speed'>{weatherData.windIn5D}km/h</h3>
      </div>
    </div>
  );
};

export default Forecast;
