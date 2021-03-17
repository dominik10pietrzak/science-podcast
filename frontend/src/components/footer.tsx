import * as React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.scss';

const Footer: React.FC = () => {
  return (
    <div className='footer'>
      <span>Podcast &copy; 2021</span>
      <div className='social-media'>
        <Link to='/'>LinkedIn</Link>
        <Link to='/'>Github</Link>
        <Link to='/'>Facebook</Link>
        <Link to='/'>Instagram</Link>
      </div>
    </div>
  );
};

export default Footer;
