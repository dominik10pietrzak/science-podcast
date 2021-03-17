import React, { useState, useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../actions/userActions';
import { updateUser } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import '../styles/user-edit.scss';

const UserEdit: React.FC<{ match: any; history: any }> = ({
  match,
  history,
}) => {
  const userId = match.params.id;

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { loading, user } = useSelector(
    (state: RootStateOrAny) => state.userDetails
  );

  const {
    error: errorUpdate,
    success: successUpdate,
    loading: loadingUpdate,
  } = useSelector((state: RootStateOrAny) => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: 'USER_UPDATE_RESET' });
      history.push('/adminpanel');
    } else {
      if (!user.name || user.id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.username);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }

    onLoadAnimations();
    return () => onLeaveAnimations();
  }, [dispatch, user, userId, history, successUpdate]);

  const onLoadAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'black';
  };

  const onLeaveAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'transparent';
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUser({ id: user.id, name, email, isAdmin }));
  };

  return (
    <div className='user-edit'>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          {errorUpdate && <Message>{errorUpdate}</Message>}
          {loadingUpdate && <Loader />}

          <label>Name</label>
          <input
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Admin</label>
          <input
            type='checkbox'
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />

          <button className='update-button' type='submit'>
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default UserEdit;
