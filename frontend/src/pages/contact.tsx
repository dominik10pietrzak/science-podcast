import React, { useEffect } from 'react';
import '../styles/contact.scss';

import MessageForm from '../components/message-form';
import ContactInfo from './ContactInfo';

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    // (document.querySelector('.navbar') as HTMLElement).classList.add('static');

    const container = document.querySelector('.contact') as HTMLElement;
    setTimeout(() => {
      container.classList.remove('contact-hidden');
    }, 350);

    // return () =>
    //   (document.querySelector('.navbar') as HTMLElement).classList.remove(
    //     'static'
    //   );
  });

  return (
    <div className='contact contact-hidden'>
      <ContactInfo />
      <MessageForm />
    </div>
  );
};

export default Contact;
