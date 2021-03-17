import React, { useState, useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { register } from '../actions/userActions';

import '../styles/login-register.scss';
import { Link, useHistory } from 'react-router-dom';

const Register: React.FC<{ location: any; history: any }> = ({ location }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userRegister = useSelector(
    (state: RootStateOrAny) => state.userRegister
  );
  const { error, loading, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }

    onLoadAnimations();

    return () => {
      onLeaveAnimations();
    };
  }, [loading, userInfo, redirect]);

  const onLoadAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'black';

    const form = document.querySelector('.login-register-form') as HTMLElement;
    setTimeout(() => {
      form.style.opacity = '1';
    }, 15);
  };

  const onLeaveAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'transparent';
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <div>
      <div className='login-register-container'>
        <form className='login-register-form' onSubmit={handleRegister}>
          <h2 className='heading'>Zarejestruj się</h2>
          <p className='sign-in-info'>
            Tworząc konto uzyskasz możliwość dodawania komentarzy.
          </p>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nazwa użytkownika'
            required
          />
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Hasło'
            required
          />
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Powtórz hasło'
            required
          />
          <button type='submit'>Utwórz konto</button>
          {error && <Message>{error}</Message>}
          {loading && <Loader />}
          <p className='sign-in-info'>
            Masz już konto?{' '}
            <Link to='/login' className='link-button'>
              <strong>Zaloguj się</strong>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
