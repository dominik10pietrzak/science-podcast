import React from 'react';
import { Route } from 'react-router';
import Comments from '../components/Comments';
import Player from './player';

const Podcast: React.FC<{ match: any }> = ({ match }) => {
  return (
    <div className='podcast'>
      <Player podcastId={match.params.id} />
      <Comments podcastId={match.params.id} />
    </div>
  );
};

export default Podcast;
