import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../actions/commentActions';
import '../styles/confirm.scss';

const Confirm: React.FC<{
  commentToDelete: number;
}> = ({ commentToDelete }) => {
  const dispatch = useDispatch();

  const clickHandler = async () => {
    await dispatch(deleteComment(commentToDelete));
    hideYourself();
  };

  const hideYourself = () => {
    (document.querySelector('.confirm') as HTMLElement).style.display = 'none';
  };

  return (
    <div className='confirm'>
      <div className='container'>
        <p>Czy na pewno chcesz usunąć ten komentarz?</p>
        <div className='buttons'>
          <button onClick={hideYourself}>Anuluj</button>
          <button className='delete' onClick={clickHandler}>
            Usuń komentarz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
