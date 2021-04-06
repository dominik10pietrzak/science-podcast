import React, { useEffect } from 'react';
import '../styles/contact.scss';

import dominik from '../assets/dominik.jpg';
import lukasz from '../assets/lukasz.jpg';
import MessageForm from '../components/message-form';

const Contact = () => {
  useEffect(() => {
    const container = document.querySelector('.contact') as HTMLElement;
    setTimeout(() => {
      container.classList.remove('contact-hidden');
    }, 350);
  });

  const handleLoadPhotos = () => {
    const photos = document.querySelectorAll('.person img');
    photos.forEach((photo: any) => {
      setTimeout(() => {
        (photo as HTMLElement).style.opacity = '1';
      }, 15);
    });
  };

  return (
    <div className='contact contact-hidden'>
      <div className='content'>
        <div className='flex-container'>
          <h1 className='heading'>Napisz do nas</h1>
          <MessageForm />
        </div>
        <div className='line'></div>
        <div className='line'></div>
        <div className='crew' onLoad={handleLoadPhotos}>
          {window.innerWidth <= 1024 ? (
            <h1 className='heading'>Kontakt</h1>
          ) : (
            ''
          )}
          <div className='crew-wrapper'>
            <div className='dominik person'>
              <div className='person-top'>
                <img src={dominik} alt='dominik' />
              </div>
              <div className='contact-forms'>
                <h1 className='name'>Dominik Pietrzak</h1>
                <p className='introduction'>Web Developer, twórca aplikacji.</p>
                <span className='social-media'>
                  <a href='https://www.linkedin.com/in/dominik-pietrzak-0223bb197/'>
                    <i className='fab fa-linkedin-in' />
                  </a>
                  <a href='https://www.facebook.com/dominik.pietrzak.10/'>
                    <i className='fab fa-facebook-f' />
                  </a>
                  <a href='https://www.instagram.com/dominik__pietrzak/?hl=pl'>
                    <i className='fab fa-instagram' />
                  </a>
                  <a href='https://github.com/dominik10pietrzak'>
                    <i className='fab fa-github' />
                  </a>
                </span>
              </div>
            </div>
            <div className='lukasz person'>
              <div className='person-top'>
                <img src={lukasz} alt='lukasz' />
              </div>
              <div className='contact-forms'>
                <h1 className='name'>Łukasz Zduńczyk</h1>
                <p className='introduction'>
                  Dziennikarz, prowadzący podcastu.
                </p>
                <span className='social-media'>
                  <a href='https://www.facebook.com/dominik.pietrzak.10/'>
                    <i className='fab fa-facebook-square' />
                  </a>
                  <a href='https://www.instagram.com/dominik__pietrzak/?hl=pl'>
                    <i className='fab fa-instagram' />
                  </a>
                </span>
                {/* <span>
                <i className='fas fa-phone' />
                605-047-257
                </span>
                <span>
                <i className='fas fa-envelope' />
                zdunczyklukasz01@gmail.com
              </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
