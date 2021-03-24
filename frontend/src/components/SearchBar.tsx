import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../styles/search-bar.scss';
import { getPodcasts } from '../actions/podcastActions';
import axios from 'axios';
import Loader from './Loader';

const SearchBar: React.FC = () => {
  const [podcasts, setPodcasts] = useState([] as any);
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  let defKeyword = history.location.search;

  if (defKeyword) {
    defKeyword = defKeyword.split('?search=')[1].split('&')[0];
  } else {
    defKeyword = '';
  }

  const [keyword, setKeyword] = useState(defKeyword.replace(/%20/g, ' '));

  const dispatch = useDispatch();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword) {
      history.push(`/podcast/?search=${keyword}&page=1`);
      dispatch(getPodcasts);
    } else {
      history.push(history.location.pathname);
    }
  };

  const changeHandler = async (word: string) => {
    if (word !== '') {
      try {
        setLoading(true);

        const { data } = await axios.get(`/api/podcast/?search=${word}&page=1`);
        setPodcasts(data.results);
        await setTimeout(() => {
          setLoading(false);
        }, 750);
      } catch (error) {
        console.log(error);
      }
    } else {
      setPodcasts([]);
    }
  };

  return (
    <div className='search-bar'>
      <form onSubmit={submitHandler}>
        <input
          id='search-input'
          type='text'
          placeholder='Szukaj podcastów'
          autoComplete='off'
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            changeHandler(e.target.value);
          }}
        />
        <div className='list'>
          {loading ? (
            <Loader />
          ) : (
            podcasts &&
            podcasts.slice(0, 5).map((podcast: any, idx: number) => (
              <Link
                className='search-podcast-link'
                key={idx}
                to={`/podcast/${podcast.id}`}>
                <img src={podcast.cover} alt='cover' />
                <div className='data'>
                  <h3 className='podcast-title'>{podcast.title}</h3>
                  <h6 className='category'>{podcast.category}</h6>
                </div>
              </Link>
            ))
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
