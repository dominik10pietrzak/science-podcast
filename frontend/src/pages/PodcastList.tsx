import React, { useEffect, useState } from 'react';
import '../styles/podcast-list.scss';
import { Link, useHistory } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../actions/podcastActions';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import Paginate from '../components/Paginate';

const PodcastList: React.FC<{ history: any }> = ({ history }) => {
  const playPodcast = (idx: number) => {
    history.push(`/podcast/${podcasts[idx].id}`);
  };

  const dispatch = useDispatch();
  const { podcasts, loading, pages, page } = useSelector(
    (state: RootStateOrAny) => state.podcastList
  );

  let keyword = history.location.search;
  let keywordValue = keyword;
  if (keyword) {
    keywordValue = keywordValue.split('=')[1].split('&')[0];
    keywordValue = keywordValue.replace(/%20/g, ' ');
  }

  useEffect(() => {
    (document.querySelector('.navbar') as HTMLElement).classList.add('static');
    dispatch(getPodcasts(keyword));

    return () =>
      (document.querySelector('.navbar') as HTMLElement).classList.remove(
        'static'
      );
  }, [dispatch, keyword]);

  const fadeInList = () => {
    const container = document.querySelector('.podcast-list') as HTMLElement;

    setTimeout(() => {
      container.classList.remove('fade-in-animation');
    }, 15);
  };

  const loadImage = (image: any) => {
    setTimeout(() => {
      (image as HTMLElement).style.opacity = '1';
    }, 25);
  };

  const chooseCategory = (e: Event) => {
    const activeButton = e.target as HTMLElement;

    if (activeButton.innerText === 'Wszystkie') {
      history.push(`/podcast/`);
    } else {
      history.push(`/podcast/?keyword=${activeButton.innerText}&page=1`);
    }
  };

  return (
    <div className='podcast-list fade-in-animation'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='settings'>
            <SearchBar />
            <h3 className='heading'>Kategorie</h3>
            <div className='categories'>
              <span
                className={`category-button`}
                onClick={(e: any) => chooseCategory(e)}>
                Wszystkie
              </span>
              <span
                className={`category-button`}
                onClick={(e: any) => chooseCategory(e)}>
                Kosmos
              </span>
              <span
                className={`category-button`}
                onClick={(e: any) => chooseCategory(e)}>
                Technologia
              </span>
              <span
                className={`category-button`}
                onClick={(e: any) => chooseCategory(e)}>
                Klimat
              </span>
            </div>
          </div>

          <div className='main' onLoad={fadeInList}>
            {podcasts[0] && !keyword ? (
              <div className='newest-podcast'>
                <img
                  className='main-cover'
                  src={podcasts[0].cover}
                  alt='cover'
                  onLoad={(e) => loadImage(e.target)}
                />
                <div className='newest-podcast-data'>
                  <h1>{podcasts[0].title}</h1>
                  <p>{podcasts[0].description}</p>
                  <Link
                    className='newest-button'
                    to={`/podcast/${podcasts[0].id}`}>
                    Słuchaj
                  </Link>
                </div>
              </div>
            ) : (
              ''
            )}
            <div className='newest-list'>
              {keyword ? (
                <h3 className='heading'>{keywordValue}:</h3>
              ) : (
                <h3 className='heading'>Najnowsze podcasty:</h3>
              )}

              <div className='content'>
                {podcasts &&
                  podcasts.map(
                    (podcast: any, idx: number) =>
                      (!keyword ? podcasts[0] !== podcast : podcasts) && (
                        <div
                          className='podcast-button'
                          onClick={() => playPodcast(idx)}
                          key={idx}>
                          <div className='podcast-cover'>
                            {podcast.cover ? (
                              <img
                                className='cover'
                                src={podcast.cover}
                                alt='cover'
                                onLoad={(e) => loadImage(e.target)}
                              />
                            ) : (
                              ''
                            )}
                          </div>
                          <h1 className='podcast-title'>{podcast.title}</h1>
                        </div>
                      )
                  )}
              </div>
              <Paginate page={page} pages={pages} keyword={keyword} />
            </div>
            {/* <div className='best-list'>
              <h3 className='heading'>Najlepiej oceniane</h3>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default PodcastList;
