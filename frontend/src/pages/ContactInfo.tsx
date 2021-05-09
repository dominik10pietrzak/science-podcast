import React from 'react';
import '../styles/contact-info.scss';

import background from '../assets/background-contact.jpg';

const ContactInfo: React.FC = () => {
  const handleGoToFormClick = () => {
    const form = document.querySelector('.message-form') as HTMLElement;
    window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
  };

  const loadImage = (image: any) => {
    setTimeout(() => {
      (image as HTMLElement).style.opacity = '1';
    }, 25);
  };

  return (
    <div className='contact-info'>
      <img
        src={background}
        alt='contact-bg'
        className='background'
        onLoad={(e) => loadImage(e.target)}
      />
      <div className='gradient'></div>

      <h1 className='section-heading'>Kontakt</h1>
      <div className='content'>
        <div className='heading-box'>
          <h1 className='heading'>Skontaktuj się z nami.</h1>
          <p>
            Nie wahaj się i skontaktuj się z nami telefonicznie lub poprzez
            email.
          </p>
          <span className='message-button' onClick={handleGoToFormClick}>
            Napisz do nas
          </span>
        </div>
        <div className='crew'>
          <div className='dominik person'>
            <div className='contact-forms'>
              <h1 className='name'>Dominik Pietrzak</h1>
              <span className='introduction'>
                Web Developer, twórca aplikacji.
              </span>
              <span className='basic-contact social'>
                <a href='https://github.com/dominik10pietrzak'>github</a>
              </span>
              <span className='basic-contact social'>
                <a href='https://www.linkedin.com/in/dominik-pietrzak-0223bb197/'>
                  linkedin
                </a>
              </span>
              <span className='basic-contact'>+48 662 792 664</span>
              <span className='basic-contact email'>d.pietrzak516@op.pl</span>
            </div>
          </div>
          <div className='lukasz person'>
            <div className='contact-forms'>
              <h1 className='name'>Łukasz Zduńczyk</h1>
              <span className='introduction'>
                Dziennikarz, prowadzący podcastu.
              </span>
              <span className='basic-contact social'>
                <a href='https://www.facebook.com/profile.php?id=100005872603770'>
                  facebook
                </a>
              </span>
              <span className='basic-contact social'>
                <a href='https://www.linkedin.com/in/%C5%82ukasz-zdu%C5%84czyk/'>
                  linkedin
                </a>
              </span>
              <span className='basic-contact'>+48 605 047 257</span>
              <span className='basic-contact email'>
                zdunczyklukasz01@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
