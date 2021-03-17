import axios from 'axios';
import React, { useState } from 'react';
import '../styles/message-form.scss';

const MessageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // const checkIfFilled = (e: Event) => {
  //   e.preventDefault();

  //   const textareas = document.querySelectorAll(
  //     '.message-form form .text-field'
  //   );

  //   textareas.forEach((item: any) => {
  //     item.style.borderColor = ' rgb(221, 221, 221)';
  //   });

  //   let isCorrect = true;
  //   textareas.forEach((item) => {
  //     if (item.value === '') {
  //       if (item.name === 'messageCompany') {
  //         return;
  //       }
  //       item.style.borderColor = 'red';
  //       isCorrect = false;
  //     } else {
  //       console.log('asd');
  //     }
  //   });

  //   if (isCorrect) {
  //     this.handleSendMessage(e);

  //     textareas.forEach((item) => {
  //       this.setState({ [item.name]: '' });
  //     });
  //   }
  // };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      await axios.post(
        '/api/users/send_message/',
        {
          name,
          email,
          subject,
          message,
        },
        config
      );

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.log(error);
    }

    // const communicate = document.querySelector(
    //   '.message-form form .bottom p'
    // ) as HTMLElement;

    // communicate.style.opacity = '1';

    // setTimeout(() => {
    //   communicate.style.opacity = '0';
    // }, 5000);
  };

  return (
    <div className='message-form'>
      <form className='form-container form-hidden' onSubmit={handleSendMessage}>
        <div className='form-flex-container'>
          <div className='form-group'>
            <label>Imię i nazwisko</label>
            <input
              className='text-field'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='off'
            />
            <label>Email</label>
            <input
              className='text-field'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='off'
            />
            <label>Temat wiadomości</label>
            <input
              className='text-field'
              type='text'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label>Wiadomość</label>
            <textarea
              className='text-field'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete='off'
            />
          </div>
        </div>
        <div className='bottom'>
          <button className='send-button' type='submit'>
            Wyślij
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
