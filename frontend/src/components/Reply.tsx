import React from 'react';
import { useHistory } from 'react-router';
import '../styles/comments.scss';
import Loader from './Loader';

interface Props {
  reply: any;
  commentId: number;
  userInfo: any;
  timeAgo: any;
  submitEditComment: (commentId: number) => void;
  startStopEditingComment: (commentId: number) => void;
  commentDeleteHandler: (commentId: number) => void;
  likeUnlike: (comment: any, commentId: number) => void;
  editCommentText: (content: any, commentId: number, replyId?: number) => void;
  showCommentForm: (commentId: number) => void;
  createCommentHandler: (
    e: React.FormEvent,
    type: string,
    commentId: number,
    replyId: number,
    author: string
  ) => void;
  hideForm: (commentId: number) => void;
}

const Reply: React.FC<Props> = ({
  reply,
  commentId,
  userInfo,
  timeAgo,
  submitEditComment,
  startStopEditingComment,
  commentDeleteHandler,
  likeUnlike,
  editCommentText,
  showCommentForm,
  createCommentHandler,
  hideForm,
}) => {
  const history = useHistory();

  return (
    <div
      id={`comment-${reply.id}`}
      className={`comment reply ${
        userInfo && reply.user === userInfo.id && 'my-comment'
      }`}
      key={reply.id}>
      <div className='comment-data-container'>
        <img
          className='author-profile-photo'
          src={reply.authorProfile.profile_pic}
          alt=''
        />
        <div className='wrapper'>
          <div className='comment-info'>
            <div className='basic'>
              <span className='author'>{reply.author}</span>
              <span className='date-added'>
                <i className='far fa-calendar'></i>
                {reply.date_added &&
                  timeAgo.format(Date.parse(reply.date_added))}
              </span>
              {reply.was_edited && <span className='edited'>(edytowano)</span>}
            </div>
            <div className='comment-user-functions'>
              {userInfo && reply.user === userInfo.id ? (
                <>
                  <div className='edit-buttons buttons-disabled'>
                    <i
                      className='fas fa-check-square accept'
                      onClick={() => submitEditComment(reply.id)}></i>
                    <i
                      className='fas fa-minus-square cancel'
                      onClick={() => startStopEditingComment(reply.id)}></i>
                  </div>
                  <div className='owner-buttons'>
                    <i
                      className='fas fa-pen edit'
                      onClick={() => startStopEditingComment(reply.id)}></i>
                    <i
                      className='fas fa-trash delete'
                      onClick={() => commentDeleteHandler(reply.id)}></i>
                  </div>
                </>
              ) : (
                <div className='activities'>
                  <i
                    className={`fas fa-heart like-button ${
                      userInfo &&
                      reply.likes.find(
                        (like: any) => like.user === userInfo.id
                      ) &&
                      'liked'
                    } `}
                    onClick={(e) => likeUnlike(e.target, reply.id)}></i>
                  <span id={`likes-${reply.id}`} className='like-balance'>
                    {reply.likes.length}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span
            id={`comment-input-${reply.id}`}
            className='content comment-content-text'
            onChange={(e) => editCommentText(e.target, commentId, reply.id)}>
            {reply.higher_author && (
              <span className='higher-author'>@{reply.higher_author}</span>
            )}
            <span className='comment-text'>{reply.text}</span>
          </span>
          <p
            className='respond-button'
            onClick={() => showCommentForm(reply.id)}>
            Odpowiedz
          </p>
          <form
            className='comment-form'
            onSubmit={(e) =>
              createCommentHandler(
                e,
                'comment',
                commentId,
                reply.id,
                reply.author
              )
            }>
            <div className='form-group'>
              <input
                id={`textBox-${reply.id}`}
                name='comment'
                autoComplete='off'
                placeholder='Napisz komentarz...'
                onClick={() => (!userInfo ? history.push('/login') : '')}
                required
              />
              <div className='line'></div>
            </div>
            <div
              className={`comment-buttons 
                            comment-active
                          `}>
              <button
                className='cancel-button'
                type='reset'
                onClick={() => hideForm(reply.id)}>
                Anuluj
              </button>
              <button
                className='submit-button'
                type='submit'
                onClick={() => hideForm(reply.id)}>
                Skomentuj
              </button>
            </div>
          </form>
        </div>
      </div>
      <Loader />
    </div>
  );
};

export default Reply;
