import React, { useState } from 'react';
import '../styles/search.scss';
import { useHistory } from 'react-router';
import SearchBar from './SearchBar';

import technology from '../assets/technology.jpg';
import space from '../assets/space.jpg';
import climate from '../assets/climate.jpg';
import podcastBG from '../assets/podcast.jpg';

const Search: React.FC<{}> = ({}) => {
  const [inputValue, setInputValue] = useState('');

  const history = useHistory();

  const chooseCategory = (e: Event) => {
    const activeButton = e.target as HTMLElement;

    console.log(activeButton);

    history.push(`/podcast/?search=${activeButton.innerText}&page=1`);
  };

  const searchInput = document.getElementById(
    'search-input'
  ) as HTMLInputElement;

  return (
    <div className='search'>
      <h3 className='heading'>Szukaj</h3>
      <SearchBar setInputValue={setInputValue} inputValue={inputValue} />
      <h3 className={`heading ${inputValue === '' ? '' : 'hidden'}`}>
        Kategorie
      </h3>
      <div className={`categories ${inputValue === '' ? '' : 'hidden'}`}>
        <div
          className={`category-button`}
          onClick={() => history.push(`/podcast/`)}>
          <span>Wszystkie</span>
          <img src={podcastBG} alt='podcast' />
        </div>
        <div
          className={`category-button`}
          onClick={(e: any) => chooseCategory(e)}>
          <span>Kosmos</span>
          <img src={space} alt='space' />
        </div>
        <div
          className={`category-button`}
          onClick={(e: any) => chooseCategory(e)}>
          <span>Technologia</span>
          <img src={technology} alt='technology' />
        </div>
        <div
          className={`category-button`}
          onClick={(e: any) => chooseCategory(e)}>
          <span>Klimat</span>
          <img src={climate} alt='climate' />
        </div>
      </div>
    </div>
  );
};
export default Search;
