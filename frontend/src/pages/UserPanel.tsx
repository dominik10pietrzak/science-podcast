import React, { useEffect, useState } from 'react';
import '../styles/user-panel.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../actions/podcastActions';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';
import cameraImage from '../assets/camera.svg';
import LikedPodcasts from '../components/LikedPodcasts';

const UserPanel: React.FC<{ history: any }> = ({ history }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state: RootStateOrAny) => state.userDetails);
  const { error, loading: loadingUser, user } = userDetails;

  const userUpdateProfile = useSelector(
    (state: RootStateOrAny) => state.userUpdateProfile
  );
  const { success } = userUpdateProfile;

  const userLogin = useSelector((state: RootStateOrAny) => state.userLogin);
  const { userInfo } = userLogin;

  const podcastList = useSelector((state: RootStateOrAny) => state.podcastList);
  const { podcasts, loading: loadingPodcasts } = podcastList;

  useEffect(() => {
    (document.querySelector('.navbar') as HTMLElement).classList.add('static');
    console.log(user);

    if (!userInfo || !userInfo.id) {
      history.push('/login');
    } else {
      if (!user || !user.name || success || userInfo.id !== user.id) {
        dispatch({ type: 'USER_UPDATE_PROFILE_RESET' });
        dispatch(getUserDetails('profile'));
      } else {
        setUsername(user.username);
        setName(user.name);
        setEmail(user.email);
        setSurname(user.last_name);
        setProfilePic(user.userProfile.profile_pic);
        setLoading(false);
        fadeInAnimations();
      }
    }
    dispatch(getPodcasts());
    return () => {
      (document.querySelector('.navbar') as HTMLElement).classList.remove(
        'static'
      );
    };
  }, [dispatch, history, success, userInfo, user]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(
        updateUserProfile({
          id: user.id,
          username: username,
          name: name,
          surname: surname,
          email: email,
          password: password,
        })
      );
      setMessage('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const fadeInAnimations = () => {
    const panel = document.querySelector('.user-panel') as HTMLElement;

    setTimeout(() => {
      panel.classList.remove('hidden');
    }, 15);
  };

  const uploadFileHandler = () => async (e: React.FormEvent | any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('profile_id', user.userProfile.id);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post(
        '/api/users/profile/upload/',
        formData,
        config
      );

      await dispatch(getUserDetails('profile'));
      setProfilePic(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const loadImage = (image: any) => {
    setTimeout(() => {
      (image as HTMLElement).style.opacity = '1';
    }, 25);
  };

  return (
    <div className='user-panel hidden'>
      {loading ? (
        <Loader />
      ) : (
        <div className='user-data'>
          <div className='user-profile-data'>
            <div className='photo-settings'>
              <div className='picture-box'>
                <img
                  className='profile-pic'
                  src={user?.userProfile.profile_pic}
                  alt='profile-pic'
                  onLoad={(e) => loadImage(e.target)}
                />
                {uploading && (
                  <div className='loader-box'>
                    <Loader />
                  </div>
                )}
                <input
                  className='profile-photo-change-button'
                  type='file'
                  placeholder='Description'
                  onChange={uploadFileHandler()}
                />
                <div className='photo-placeholder'>
                  <img src={cameraImage} alt='camera-button-placeholder' />
                </div>
                <span className='username'>{user?.username}</span>
              </div>
              <div className='basic-data'>
                <div className='stats-container'>
                  <div className='stats-child'>
                    <p className='stats-number'>
                      {podcasts
                        ? podcasts.filter((podcast: any) =>
                            podcast.likes.find(
                              (like: any) => like.user === userInfo?.id
                            )
                          ).length
                        : 0}
                    </p>
                    <span className='stats-name'>Polubione podcasty</span>
                  </div>
                  <div className='line'></div>
                  <div className='stats-child'>
                    <p className='stats-number'>
                      {user?.writtenCommentsNumber}
                    </p>
                    <span className='stats-name'>Napisane komentarze</span>
                  </div>
                </div>
                <div className='user-info-container'>
                  <p className='user-info-name'>
                    <i className='far fa-user'></i>
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className='user-info-name'>
                    <i className='fas fa-envelope-square'></i>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form className='data-form' onSubmit={submitHandler}>
            <h3 className='heading'>Edytuj informacje</h3>
            <label>Nazwa użytkownika</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className='form-group'>
              <div className='form-input'>
                <label>Imię</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='form-input'>
                <label>Nazwisko</label>
                <input
                  type='text'
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>
            <label>Email</label>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h3 className='heading'>Zmień hasło</h3>
            <label>Hasło</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Potwierdź hasło</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type='submit'>Zapisz</button>
          </form>
          <LikedPodcasts userInfo={userInfo} />
        </div>
      )}
    </div>
  );
};

export default UserPanel;
