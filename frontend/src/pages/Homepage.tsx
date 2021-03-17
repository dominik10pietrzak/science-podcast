import React, { useEffect, useState } from 'react';
import '../styles/homepage.scss';

import background from '../assets/background-landing.jpg';
import backgroundWeather from '../assets/background-weather-preview.jpg';

import { Link } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcastDetails } from '../actions/podcastActions';
import Loader from '../components/Loader';

import { translateDescription } from '../functions/functions';

import axios from 'axios';

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const [temp, setTemp] = useState(0);
  const [desc, setDesc] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);

  const { podcast, loading } = useSelector(
    (state: RootStateOrAny) => state.podcastDetails
  );

  const getWeather = async () => {
    const APIKey = 'e7eec20a0655f51584d3e1a50afa74ca';
    const API = `https://api.openweathermap.org/data/2.5/forecast?q=Warsaw&appid=${APIKey}&units=metric`;

    setWeatherLoading(true);
    try {
      const { data } = await axios.get(API);
      setTemp(data.list[0].main.temp);
      setDesc(data.list[0].weather[0].main);

      setWeatherLoading(false);
    } catch (error) {
      console.log(error);
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getPodcastDetails(0));
    if (podcast.title) {
      loadTextContent();
    }
    if (!temp || !desc) {
      getWeather();
    }

    if (window.innerWidth < 1024) {
      const sections = document.querySelectorAll('.landing .podcast-preview');
      sections.forEach((section) => {
        (section as HTMLElement).style.height = `${window.innerHeight}px`;
      });
    }
  }, [dispatch, podcast]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'PODCAST_DETAILS_RESET' });
    };
  }, []);

  const loadImage = (e: any) => {
    setTimeout(() => {
      (e.target as any).style.opacity = '1';
    }, 100);
  };

  const loadTextContent = () => {
    const texts = document.querySelectorAll('.text-content');
    texts[0] &&
      setTimeout(() => {
        (texts[0] as any).classList.remove('hidden');
      }, 15);

    window.addEventListener('scroll', () => {
      texts.forEach((text: any) => {
        if (window.scrollY > text.offsetTop + text.offsetHeight) {
          (text as any).classList.remove('hidden');
        }
      });
    });
  };

  return (
    <div className='landing'>
      <div className='podcast-preview section-preview'>
        <img
          className='background-image'
          src={background}
          alt='sky'
          onLoad={loadImage}
        />
        {podcast && podcast.title ? (
          <div className='text-content hidden'>
            <h3>Najnowszy podcast</h3>
            <h1 className='podcast-title'>{podcast && podcast.title}</h1>
            <Link to={`/podcast`} className='basic-button' id='podcast-button'>
              Przejdź do podcastu
            </Link>
          </div>
        ) : loading ? (
          <Loader />
        ) : (
          ''
        )}
      </div>
      <div className='podcast-preview section-preview'>
        <img
          className='background-image'
          src={backgroundWeather}
          alt='sky'
          onLoad={loadImage}
        />
        {temp !== 0 ? (
          <div className='text-content hidden'>
            <h3>Pogoda w Warszawie</h3>
            <h1 className='podcast-title'>
              {Math.round(temp)}&#176; {translateDescription(desc)}
            </h1>
            <Link to={`/weather`} className='basic-button' id='podcast-button'>
              Przejdź do prognozy
            </Link>
          </div>
        ) : weatherLoading ? (
          <Loader />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Landing;
