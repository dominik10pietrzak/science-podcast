import React, { Component } from 'react';
import CurrentWeather from './current-weather';
import Forecast from '../components/forecast';
import '../styles/weather.scss';
import axios from 'axios';
import Loader from '../components/Loader';

class Weather extends Component {
  state = {
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
    descIn1D: 'Clear',
    descIn2D: 'Clear',
    descIn3D: 'Clear',
    descIn4D: 'Clear',
    descIn5D: 'Clear',

    loading: false,
  };

  fetchWeather = async (value: string) => {
    const backgroundFile = document.querySelector(
      '.weather .background'
    ) as HTMLElement;
    this.setState({ loading: true });

    const API = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${this.state.APIKey}&units=metric`;

    backgroundFile &&
      setTimeout(() => {
        backgroundFile.style.opacity = '0';
      }, 15);

    try {
      const { data } = await axios.get(API);

      let index = 0;
      for (let i = 0; i < 8; i++) {
        const hour = new Date(data.list[i].dt_txt).getHours();
        if (hour === 15) {
          index = i;
          break;
        }
      }

      this.setState({
        currentTemp: data.list[0].main.temp,
        city: data.city.name,
        country: data.city.country,
        humidity: data.list[0].main.humidity,
        windSpeed: data.list[0].wind.speed,
        description: data.list[0].weather[0].main,
        tempIn1D: data.list[index].main.temp,
        tempIn2D: data.list[index + 8].main.temp,
        tempIn3D: data.list[index + 16].main.temp,
        tempIn4D: data.list[index + 24].main.temp,
        tempIn5D: data.list[index + 32].main.temp,
        descIn1D: data.list[index].weather[0].main,
        descIn2D: data.list[index + 8].weather[0].main,
        descIn3D: data.list[index + 16].weather[0].main,
        descIn4D: data.list[index + 24].weather[0].main,
        descIn5D: data.list[index + 32].weather[0].main,
      });

      backgroundFile &&
        setTimeout(() => {
          backgroundFile.style.opacity = '1';
        }, 15);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
    setTimeout(() => {
      this.setState({ loading: false });
      this.showWeatherData();
    }, 300);
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
    const videoUrl = require(`../assets/${this.state.description}.mp4`).default;
    const imageUrl = require(`../assets/weather-bg/${this.state.description}.jpg`)
      .default;
    const { loading, value } = this.state;

    return (
      <div className='weather'>
        {/* <img
					className='background'
					src={
						require(`../../assets/${this.state.description}.jpg`)
							.default
					}
					alt='weather-img'
				/> */}
        {window.innerWidth > 420 ? (
          <video
            className='background'
            autoPlay
            muted
            loop
            id='myVideo'
            src={videoUrl}
          />
        ) : (
          <img className='background' src={imageUrl} alt='bg' />
        )}
        {loading ? (
          <Loader />
        ) : (
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
            <Forecast weatherData={this.state} />
          </div>
        )}
      </div>
    );
  }
}

export default Weather;
