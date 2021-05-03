import React from 'react';
import '../styles/liked-podcasts.scss';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IUser } from '../functions/interfaces';
import Loader from './Loader';

interface Props {
  userInfo: IUser;
}

const LikedPodcasts: React.FC<Props> = ({ userInfo }) => {
  const podcastList = useSelector((state: RootStateOrAny) => state.podcastList);
  const { podcasts, loading: loadingPodcasts } = podcastList;

  return (
    <div className='liked-podcasts'>
      <h3 className='heading'>Polubienia:</h3>
      {loadingPodcasts ? (
        <Loader />
      ) : (
        podcasts
          .filter((podcast: any) =>
            podcast.likes.find((like: any) => like.user === userInfo?.id)
          )
          .sort((a: any, b: any) => {
            const idxA = a.likes.findIndex(
              (like: any) => like.user === userInfo.id
            );
            const idxB = b.likes.findIndex(
              (like: any) => like.user === userInfo.id
            );

            return (
              Date.parse(b.likes[idxB].created) -
              Date.parse(a.likes[idxA].created)
            );
          })
          .map((podcast: any, idx: number) => (
            <Link
              className='liked-podcast-link'
              key={podcast.title}
              to={`podcast/${podcast.id}`}>
              <span>{idx + 1}</span>
              <div className='cover-wrapper'>
                <img src={podcast.cover} alt='cover' />
              </div>
              <h3>{podcast.title}</h3>
            </Link>
          ))
      )}
    </div>
  );
};

export default LikedPodcasts;
