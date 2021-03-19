import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/login-register.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { login } from '../actions/userActions';

const Login: React.FC<{ location: any; history: any }> = ({
  location,
  history,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const { error, loading, userInfo } = useSelector(
    (state: RootStateOrAny) => state.userLogin
  );

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }

    // (document.querySelector(
    //   '.login-register-container'
    // ) as HTMLElement).style.height = `${window.innerHeight}px`;
    onLoadAnimations();

    return () => {
      onLeaveAnimations();
    };
  }, [userInfo, redirect, location]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  const onLoadAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'black';

    const form = document.querySelector('.login-register-form') as HTMLElement;
    setTimeout(() => {
      form.style.opacity = '1';
    }, 100);
  };

  const onLeaveAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'transparent';
  };

  return (
    <div className='login-register-container'>
      <form className='login-register-form' onSubmit={handleLogin}>
        <h2 className='heading'>Zaloguj się</h2>
        <p className='sign-in-info'>Wypełnij formularz, aby się zalogować</p>
        <input
          type='text'
          placeholder='Nazwa użytkownika'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='Hasło'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Zaloguj się</button>
        {error && <Message>{error}</Message>}
        {loading && <Loader />}
        <p className='sign-in-info'>
          Nie masz konta?{' '}
          <Link to='/register' className='link-button'>
            <strong>Zarejestruj się</strong>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
