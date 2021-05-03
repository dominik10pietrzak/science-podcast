import React, { useEffect, useState } from 'react';
import '../styles/podcast-list.scss';

import TimeAgo from 'javascript-time-ago';
import pl from 'javascript-time-ago/locale/pl';

import { Link } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../actions/podcastActions';
import Loader from '../components/Loader';
import Search from '../components/Search';

const PodcastList: React.FC<{ history: any }> = ({ history }) => {
  TimeAgo.addLocale(pl);
  const timeAgo = new TimeAgo('pl-PL');
  timeAgo.format(new Date());

  const playPodcast = (idx: number) => {
    history.push(`/podcast/${podcasts[idx].id}`);
  };

  const dispatch = useDispatch();
  const { podcasts, loading } = useSelector(
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
    if (podcasts.length === 0) {
      dispatch(getPodcasts(keyword));
    }

    return () =>
      (document.querySelector('.navbar') as HTMLElement).classList.remove(
        'static'
      );
  }, [dispatch, keyword]);

  const fadeInList = async () => {
    const container = document.querySelector('.podcast-list') as HTMLElement;
    const podcastButtons = document.querySelectorAll('.podcast-button');

    podcastButtons.forEach(
      (button, idx) =>
        ((button as HTMLElement).style.transition = `all 0.3s ease ${
          idx * 0.03
        }s`)
    );

    setTimeout(() => {
      container.classList.remove('fade-in-animation');
    }, 300);
  };

  const loadImage = (image: any) => {
    setTimeout(() => {
      (image as HTMLElement).style.opacity = '1';
    }, 25);
  };

  return (
    <div className='podcast-list fade-in-animation'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Search />
          <div className='main' onLoad={fadeInList}>
            {podcasts[0] && !keyword ? (
              <div className='newest-podcast'>
                <div className='main-cover'>
                  <img
                    className='main-cover'
                    src={podcasts[0].cover}
                    alt='cover'
                    onLoad={(e) => loadImage(e.target)}
                  />
                </div>
                <div className='newest-podcast-data'>
                  <h1>{podcasts[0].title}</h1>
                  <p className='description'>{podcasts[0].description}</p>
                  <Link
                    className='basic-button'
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
                <h3 className='heading'>{keywordValue}</h3>
              ) : (
                <h3 className='heading'>Najnowsze podcasty</h3>
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
                            <span className='likes-comments-count'>
                              <i className='far fa-heart like-button'></i>{' '}
                              {podcast.likes.length}
                            </span>
                            <span className='likes-comments-count'>
                              <i className='far fa-comment comment-button'></i>{' '}
                              {podcast.commentsCount}
                            </span>
                          </div>
                          <h1 className='podcast-title'>{podcast.title}</h1>
                          <div className='additional-info'>
                            {podcast.category}
                          </div>
                          <div className='additional-info'>
                            {timeAgo.format(Date.parse(podcast.date_added))}
                          </div>
                        </div>
                      )
                  )}
              </div>
              {/* <Paginate page={page} pages={pages} keyword={keyword} /> */}
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
