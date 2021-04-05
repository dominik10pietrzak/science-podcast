import React, { useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { useHistory } from 'react-router';
import logo from '../assets/logo.png';
import '../styles/navbar.scss';

import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { userInfo } = useSelector((state: RootStateOrAny) => state.userLogin);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const menuButtons = document.querySelectorAll('.navigation-button');
    const sideButtons = document.querySelectorAll('.side-button');
    const sliders = document.querySelectorAll('.navigation-button .slider');

    menuButtons.forEach((button, idx) => {
      // button.setAttribute('data-before', (button as HTMLElement).innerText);

      button.addEventListener('mouseenter', () => {
        (button as HTMLElement).style.justifyContent = 'flex-start';
        // (button as HTMLElement).style.clipPath = '';
        (sliders[idx] as HTMLElement).style.width = '100%';
      });

      button.addEventListener('mouseleave', () => {
        (button as HTMLElement).style.justifyContent = 'flex-end';
        (sliders[idx] as HTMLElement).style.width = '0';
      });
    });

    sideButtons.forEach((button, idx) => {
      (button as HTMLElement).style.transition = `all 0.3s ease ${
        idx * 0.05 + 0.1
      }s`;
    });
  }, [userInfo, history]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const addOffClick = (e: Event, fun: any) => {
    const offClick = (evt: Event) => {
      if (e !== evt) {
        fun();
        document.removeEventListener('click', offClick);
      }
    };
    document.addEventListener('click', offClick);
  };

  const handleButtonClick = (e: any) => {
    e.stopPropagation();
    const hamburger = document.querySelector('.menu-button') as HTMLElement;
    const menu = document.querySelector('.navbar') as HTMLElement;

    const toggleMenu = () => {
      hamburger.classList.toggle('button-active');
      menu.classList.toggle('navbar-active');
    };

    toggleMenu();
    if (!menu.classList.contains('navbar-active')) {
      addOffClick(e, toggleMenu);
    }
  };

  return (
    <div className='navbar navbar-active'>
      <Link to='/' className='name'>
        <img src={logo} alt='logo' />
        <h3>
          <strong>Naukowy</strong>
          Podcast
        </h3>
      </Link>
      <div className='menu'>
        <div className='main-menu'>
          <Link to='/' className='navigation-button'>
            Home
            <span className='slider' />
          </Link>
          <Link to='/podcast' className='navigation-button'>
            Podcast
            <span className='slider' />
          </Link>
          <Link to='/weather' className='navigation-button'>
            Pogoda
            <span className='slider' />
          </Link>
          <Link to='/contact' className='navigation-button'>
            Kontakt
            <span className='slider' />
          </Link>
        </div>

        <div className='hidden-menu'>
          <Link to='/' className='navigation-button side-button'>
            Home
            <span className='slider' />
          </Link>
          <Link to='/podcast' className='navigation-button side-button'>
            Podcast
            <span className='slider' />
          </Link>
          <Link to='/weather' className='navigation-button side-button'>
            Pogoda
            <span className='slider' />
          </Link>
          <Link to='/contact' className='navigation-button side-button'>
            Kontakt
            <span className='slider' />
          </Link>
          {userInfo && userInfo.isAdmin ? (
            <Link to='/adminpanel' className='navigation-button side-button'>
              Admin
              <span className='slider' />
            </Link>
          ) : (
            ''
          )}
          {userInfo ? (
            <>
              <Link to='/user' className='navigation-button side-button'>
                {userInfo.username}
                <i className='far fa-user'></i>
                <span className='slider' />
              </Link>
              <span
                className='navigation-button side-button'
                onClick={logoutHandler}>
                Wyloguj
                <span className='slider' />
              </span>
            </>
          ) : (
            <>
              <Link to='/login' className='navigation-button side-button'>
                Logowanie
                <span className='slider' />
              </Link>
              <Link to='/register' className='navigation-button side-button'>
                Rejestracja
                <span className='slider' />
              </Link>
            </>
          )}
        </div>

        <div className='side-menu'>
          <div className='side-menu-option-buttons'>
            {userInfo && userInfo.isAdmin ? (
              <Link to='/adminpanel' className='navigation-button'>
                Admin
                <span className='slider' />
              </Link>
            ) : (
              ''
            )}
            {userInfo ? (
              <>
                <Link to='/user' className='navigation-button'>
                  {userInfo.username}
                  <i className='far fa-user'></i>
                  <span className='slider' />
                </Link>
                <span className='navigation-button' onClick={logoutHandler}>
                  Wyloguj
                  <span className='slider' />
                </span>
              </>
            ) : (
              <>
                <Link to='/login' className='navigation-button'>
                  Logowanie
                  <span className='slider' />
                </Link>
                <Link to='/register' className='navigation-button'>
                  Rejestracja
                  <span className='slider' />
                </Link>
              </>
            )}
          </div>
          <div
            className='menu-button'
            onClick={(e) => {
              handleButtonClick(e);
            }}>
            <div className='line' />
            <div className='line' />
            <div className='line' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
