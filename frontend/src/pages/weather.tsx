import React, { Component } from 'react';
import CurrentWeather from './current-weather';
import Forecast from '../components/forecast';
import '../styles/weather.scss';
import axios from 'axios';
import Loader from '../components/Loader';
import WeatherChart from '../components/WeatherChart';

class Weather extends Component {
  state = {
    loaded: false,
    APIKey: 'e7eec20a0655f51584d3e1a50afa74ca',
    currentTemp: '',
    city: 'Warsaw',
    value: '',
    country: 'PL',
    humidity: '',
    windSpeed: '',
    description: 'Rain',
    tempIn1D: '',
    tempIn2D: '',
    tempIn3D: '',
    tempIn4D: '',
    tempIn5D: '',
    tempIn3H: 0,
    tempIn6H: 0,
    tempIn9H: 0,
    tempIn12H: 0,
    tempIn15H: 0,
    tempIn18H: 0,
    tempIn21H: 0,
    descIn1D: 'Clear',
    descIn2D: 'Clear',
    descIn3D: 'Clear',
    descIn4D: 'Clear',
    descIn5D: 'Clear',

    loading: false,
  };

  fetchWeather = async (value: string) => {
    const bgTop = document.getElementById('bg-top') as any;
    const bgBottom = document.getElementById('bg-bottom') as any;
    this.setState({ loading: true });

    const API = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${this.state.APIKey}&units=metric`;

    try {
      const { data } = await axios.get(API);
      console.log(data);
      let index = 0;
      for (let i = 0; i < 8; i++) {
        const hour = new Date(data.list[i].dt_txt).getHours();
        if (hour === 15) {
          index = i;
          break;
        }
      }

      this.setState({
        loaded: true,
        currentTemp: data.list[0].main.temp,
        city: data.city.name,
        country: data.city.country,
        humidity: data.list[0].main.humidity,
        windSpeed: data.list[0].wind.speed,
        description: data.list[0].weather[0].main,
        tempIn1D: Math.round(data.list[index].main.temp),
        tempIn2D: Math.round(data.list[index + 8].main.temp),
        tempIn3D: Math.round(data.list[index + 16].main.temp),
        tempIn4D: Math.round(data.list[index + 24].main.temp),
        tempIn5D: Math.round(data.list[index + 32].main.temp),
        tempIn3H: Math.round(data.list[1].main.temp),
        tempIn6H: Math.round(data.list[2].main.temp),
        tempIn9H: Math.round(data.list[3].main.temp),
        tempIn12H: Math.round(data.list[4].main.temp),
        tempIn15H: Math.round(data.list[5].main.temp),
        tempIn18H: Math.round(data.list[6].main.temp),
        tempIn21H: Math.round(data.list[7].main.temp),
        descIn1D: data.list[index].weather[0].main,
        descIn2D: data.list[index + 8].weather[0].main,
        descIn3D: data.list[index + 16].weather[0].main,
        descIn4D: data.list[index + 24].weather[0].main,
        descIn5D: data.list[index + 32].weather[0].main,
        windIn1D: Math.round(data.list[index].wind.speed),
        windIn2D: Math.round(data.list[index + 8].wind.speed),
        windIn3D: Math.round(data.list[index + 16].wind.speed),
        windIn4D: Math.round(data.list[index + 24].wind.speed),
        windIn5D: Math.round(data.list[index + 32].wind.speed),
      });

      const src = data.list[0].weather[0].main;
      bgBottom.src = require(`../assets/weather-bg/${src}.jpg`).default;
      await bgTop.classList.add('hidden');

      setTimeout(() => {
        bgTop.src = require(`../assets/weather-bg/${src}.jpg`).default;
        bgTop.classList.remove('hidden');
      }, 300);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 15);
  };

  searchForWeather = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.value.toUpperCase() !== this.state.city.toUpperCase()) {
      this.fetchWeather(this.state.value);
    }
    this.setState({ value: '' });
  };

  componentDidMount = () => {
    window.scrollTo({ top: 0 });
    this.fetchWeather('Warszawa');
  };

  showWeatherData = () => {
    const weatherContent = document.querySelector(
      '.weather-content'
    ) as HTMLElement;

    setTimeout(() => {
      weatherContent && weatherContent.classList.remove('content-hidden');
    }, 150);
  };

  render() {
    const { loaded, value } = this.state;

    return (
      <div className='weather' onLoad={this.showWeatherData}>
        {loaded ? (
          <>
            <img
              id='bg-top'
              className='background hidden'
              src={require(`../assets/weather-bg/Clouds.jpg`).default}
              alt='bg'
              onLoad={(e) =>
                (e.target as HTMLElement).classList.remove('hidden')
              }
            />
            <img
              id='bg-bottom'
              className='background hidden'
              src={require(`../assets/weather-bg/Clouds.jpg`).default}
              alt='bg2'
              onLoad={(e) =>
                (e.target as HTMLElement).classList.remove('hidden')
              }
            />
            <div className='weather-content content-hidden'>
              <form
                className='search-form'
                onSubmit={(e) => this.searchForWeather(e)}>
                <input
                  type='text'
                  value={value}
                  onChange={(e) => this.setState({ value: e.target.value })}
                  placeholder='Wpisz nazwę miasta'
                />
                <button type='submit'>
                  <i className='fas fa-search' />
                </button>
              </form>
              <CurrentWeather weatherData={this.state} />
              <WeatherChart weatherData={this.state} />
              <Forecast weatherData={this.state} />
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default Weather;
