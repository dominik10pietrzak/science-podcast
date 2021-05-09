import React, { useEffect, useState } from 'react';
import '../styles/homepage.scss';

import background from '../assets/background-landing.jpg';

import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  useEffect(() => {
    loadTextContent();
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (window.innerWidth < 1024) {
      const sections = document.querySelectorAll('.landing .podcast-preview');
      sections.forEach((section) => {
        (section as HTMLElement).style.height = `${window.innerHeight}px`;
      });
    }
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
        <div className='text-content hidden'>
          {/* <h1 className='podcast-title'>{podcast && podcast.title}</h1> */}
          <h1 className='podcast-title'>Podcast popularno naukowy</h1>
          <p className='description'>
            Prowadzącym podcastu jest Łukasz Zduńczyk, dziennikarz Radia Kampus.
            Już teraz słuchaj podcastów o tematyce takiej jak kosmos, klimat czy
            technologia.
          </p>
          <Link to={`/podcast`} className='basic-button' id='podcast-button'>
            Przejdź
          </Link>
        </div>
      </div>
      {/* <div className='section-preview about'></div> */}
    </div>
  );
};

export default Landing;
