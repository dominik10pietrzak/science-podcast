import React, { useEffect, useState } from 'react';
import '../styles/player.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcastDetails } from '../actions/podcastActions';
import Loader from '../components/Loader';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

const Player: React.FC<{ podcastId: number }> = ({ podcastId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([] as any);
  const [podcastPreview, setPodcastPreview] = useState({}) as any;
  const [mobileLayout, setMobileLayout] = useState(window.innerWidth < 420);

  const dispatch = useDispatch();
  const history = useHistory();

  const { podcast, loading } = useSelector(
    (state: RootStateOrAny) => state.podcastDetails
  );

  const { userInfo } = useSelector((state: RootStateOrAny) => state.userLogin);

  const getPodcastPreview = async () => {
    try {
      const { data } = await axios.get(`/api/podcast/${podcastId}/preview/`);

      setPodcastPreview(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfMobile = () => {
    const player = document.querySelector('.player') as HTMLElement;
    if (player && window.innerWidth < 420) {
      setMobileLayout(true);
      player.style.background = `rgb${podcast.dominant_color}`;
    } else {
      setMobileLayout(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('resize', checkIfMobile);

    if (!podcast.title || podcast.id !== Number(podcastId)) {
      dispatch(getPodcastDetails(podcastId));
      getPodcastPreview();
    } else {
      fadeInPlayer();
      setLikesCount(podcast.likes.length);
      setLikes(podcast.likes);
      if (window.innerWidth < 420) {
        (document.querySelector(
          '.player'
        ) as HTMLElement).style.background = `rgb${podcast.dominant_color}`;
      }
      if (
        userInfo &&
        podcast.likes.find((like: any) => like.user === userInfo.id)
      ) {
        setIsLiked(true);
      }
    }
  }, [dispatch, podcast, userInfo, podcastId, podcastPreview]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'PODCAST_DETAILS_RESET' });
    };
  }, []);

  const fadeInPlayer = () => {
    const player = document.querySelector('.player') as HTMLElement;

    setTimeout(() => {
      player.classList.remove('fade-in-animation');
    }, 25);
  };

  const loadImage = (image: any) => {
    setTimeout(() => {
      image.style.opacity = '1';
    }, 100);
  };

  const likeUnlike = async () => {
    if (!userInfo) {
      history.push('/login');
      return;
    }

    const likeButton = document.querySelector('.like-button') as HTMLElement;

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        data: {
          type: 'podcast',
        },
      };

      likeButton.classList.toggle('liked');
      setIsLiked(!isLiked);

      if (isLiked) {
        setLikesCount(likesCount - 1);
        await axios.delete(`/api/podcast/${podcastId}/unlike/`, config);
        likes.splice(likes.indexOf(userInfo.id), 1);
      } else {
        setLikesCount(likesCount + 1);
        await axios.post(
          `/api/podcast/${podcastId}/like/`,
          { type: 'podcast' },
          config
        );
        likes.push(userInfo.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToComments = () => {
    const comments = document.querySelector('.comments') as HTMLElement;
    window.scrollTo({ top: comments.offsetTop, behavior: 'smooth' });
  };

  const handleGoNext = () => {
    history.push(`/podcast/${podcastPreview.id}`);
    history.go(0);
  };

  const setPreviewBackground = () => {
    const preview = document.querySelector(
      '.next-podcast-preview'
    ) as HTMLElement;

    if (preview) {
      preview.style.backgroundColor = `rgba${podcastPreview.dominant_color.slice(
        0,
        -1
      )}, .5)`;
    }

    setTimeout(() => {
      preview.classList.remove('hidden');
    }, 1500);
  };

  return (
    <div className='player fade-in-animation'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='content'>
            {podcast.background && !mobileLayout ? (
              <img
                src={podcast.background}
                alt='cover'
                className='background'
                onLoad={(e) => loadImage(e.target)}
              />
            ) : (
              <div className='podcast-cover'>
                <img
                  src={podcast.cover}
                  alt='cover'
                  className='cover'
                  onLoad={(e) => loadImage(e.target)}
                />
              </div>
            )}
            <div className='gradient'></div>
            <div className='wrapper'>
              <div className='flex-container'>
                <div className='podcast-data'>
                  <h1 className='title'>{podcast.title}</h1>
                  <div className='activities'>
                    <span className='activity'>
                      <i
                        className={`far fa-heart like-button ${
                          isLiked ? 'liked' : ''
                        }`}
                        onClick={likeUnlike}></i>
                      <span className='like-balance'>{likesCount}</span>
                    </span>
                    <span className='activity'>
                      <i
                        className='far fa-comment comment-button'
                        onClick={goToComments}></i>
                      {podcast.commentsCount}
                    </span>
                  </div>
                  <p className='description'>{podcast.description}</p>
                  <iframe
                    title={podcast.title}
                    className='audio-player'
                    src={`https://open.spotify.com/embed-podcast/episode/${podcast.code}`}
                    width='100%'
                    frameBorder='0'
                    allowTransparency
                    allow='encrypted-media'
                    onLoad={(e) =>
                      ((e.target as HTMLElement).style.opacity = '1')
                    }></iframe>
                </div>
              </div>
            </div>
          </div>
          {podcastPreview.title && (
            <div
              className='next-podcast-preview hidden'
              onLoad={setPreviewBackground}>
              <div
                className='hide-btn'
                onClick={() =>
                  (document.querySelector(
                    '.next-podcast-preview'
                  ) as HTMLElement).classList.add('hidden')
                }>
                <i className='fas fa-times'></i>
              </div>
              <div className='wrapper'>
                <span className='heading-preview'>Posłuchaj także:</span>
                <span onClick={handleGoNext}>
                  <h3 className='preview-title'>{podcastPreview.title}</h3>
                </span>
              </div>
              <img
                src={podcastPreview.cover}
                alt='preview-cover'
                onLoad={(e) => loadImage(e.target)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Player;
