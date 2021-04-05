import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../styles/search-bar.scss';
import { getPodcasts } from '../actions/podcastActions';
import axios from 'axios';
import Loader from './Loader';

const SearchBar: React.FC<{ setInputValue: any; inputValue: string }> = ({
  setInputValue,
  inputValue,
}) => {
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

  const clearForm = () => {
    focusOnForm();
    setKeyword('');
    setInputValue('');
    (document.getElementById('search-input') as HTMLInputElement).value = '';
  };

  const focusOnForm = () => {
    document.getElementById('search-input')?.focus();
  };

  const searchInput = document.getElementById(
    'search-input'
  ) as HTMLInputElement;

  return (
    <div className='search-bar'>
      <form onSubmit={submitHandler} onClick={focusOnForm}>
        <i className='fas fa-search'></i>
        <input
          id='search-input'
          type='text'
          placeholder='Szukaj podcastów'
          autoComplete='off'
          onChange={(e) => {
            setKeyword(e.target.value);
            setInputValue(e.target.value);
            changeHandler(e.target.value);
          }}
        />
        <i
          className={`fas fa-times clear ${
            searchInput && searchInput.value !== '' ? '' : 'hidden'
          }`}
          onClick={clearForm}></i>
        <div className={`list ${inputValue === '' ? 'hidden' : ''}`}>
          {loading ? (
            <Loader />
          ) : (
            podcasts &&
            podcasts.slice(0, 5).map((podcast: any, idx: number) => (
              <Link
                className='search-podcast-link'
                key={idx}
                to={`/podcast/${podcast.id}`}>
                <div className='cover'>
                  <img src={podcast.cover} alt='cover' />
                </div>
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
