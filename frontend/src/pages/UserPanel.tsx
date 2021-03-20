import React, { useEffect, useState } from 'react';
import '../styles/user-panel.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcasts } from '../actions/podcastActions';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';

const UserPanel: React.FC<{ history: any }> = ({ history }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          email: email,
          password: password,
        })
      );
      setMessage('');
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

  return (
    <div className='user-panel hidden'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='liked-podcasts'>
            <h3 className='heading'>Polubienia:</h3>
            {loadingPodcasts ? (
              <Loader />
            ) : (
              podcasts
                .filter((podcast: any) =>
                  podcast.likes.find((like: any) => like.user === userInfo.id)
                )
                .sort((a: any, b: any) => {
                  const idxA = a.likes.findIndex(
                    (like: any) => like.user === userInfo.id
                  );
                  const idxB = b.likes.findIndex(
                    (like: any) => like.user === userInfo.id
                  );

                  return (
                    Date.parse(b.likes[idxB].created) -
                    Date.parse(a.likes[idxA].created)
                  );
                })
                .map((podcast: any, idx: number) => (
                  <Link
                    className='liked-podcast-link'
                    key={podcast.title}
                    to={`podcast/${podcast.id}`}>
                    <span>{idx + 1}</span>
                    <img src={podcast.cover} alt='cover' />
                    <h3>{podcast.title}</h3>
                  </Link>
                ))
            )}
          </div>
          <div className='user-data'>
            <div className='photo-settings'>
              <div className='picture-box'>
                {user && (
                  <img
                    className='profile-pic'
                    src={user.userProfile && user.userProfile.profile_pic}
                    alt=''
                  />
                )}
                {uploading && (
                  <div className='loader-box'>
                    <Loader />
                  </div>
                )}
              </div>
              <div className='basic-data'>
                <h1 className='username'>{user && user.username}</h1>
                <div className='picture-form'>
                  <button>Zmień zdjęcie</button>
                  <input
                    type='file'
                    placeholder='Description'
                    onChange={uploadFileHandler()}
                  />
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
              <label>Imię</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <button type='submit'>Aktualizuj</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPanel;
