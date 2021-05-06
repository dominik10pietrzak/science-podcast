import axios from 'axios';
import React, { useState } from 'react';
import '../styles/message-form.scss';

const MessageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
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
          surname,
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
  };

  return (
    <div className='message-form'>
      <form className='form-container form-hidden' onSubmit={handleSendMessage}>
        <h3 className='heading'>Napisz do nas</h3>
        <p>
          Interesuje Cię współpraca z nami? Wypełnij formularz i wyślij
          wiadomość, dotrze ona do nas obu.
        </p>
        <div className='form-group'>
          <div>
            <label>Imię</label>
            <input
              className='text-field'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='off'
            />
          </div>
          <div>
            <label>Nazwisko</label>
            <input
              className='text-field'
              type='text'
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoComplete='off'
            />
          </div>
        </div>
        <label>Email</label>
        <input
          className='text-field'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='off'
        />

        <label>Wiadomość</label>
        <textarea
          className='text-field'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete='off'
        />
        <button type='submit'>Wyślij</button>
      </form>
    </div>
  );
};

export default MessageForm;
