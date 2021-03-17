import React, { useEffect, useState } from 'react';
import '../styles/comment.scss';

import { useHistory } from 'react-router';
import Loader from './Loader';

interface Props {
  comment: any;
  commentId?: number;
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
  isReply?: boolean;
}

const Comment: React.FC<Props> = ({
  comment,
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
  isReply,
}) => {
  const history = useHistory();

  return (
    <div
      id={`comment-${comment.id}`}
      className={`comment ${
        userInfo && comment.user === userInfo.id && 'my-comment'
      } ${isReply && 'reply'}`}>
      <div className='comment-data-container'>
        <img
          className='author-profile-photo'
          src={comment.authorProfile.profile_pic}
          alt='profile-pic'
        />
        <div className='wrapper'>
          <div className='comment-info'>
            <div className='basic'>
              <span className='author'>{comment.author}</span>
              <span className='date-added'>
                <i className='far fa-calendar'></i>
                {comment.date_added &&
                  timeAgo.format(Date.parse(comment.date_added))}
              </span>
              {comment.was_edited && (
                <span className='edited'>(edytowany)</span>
              )}
            </div>
            <div className='comment-user-functions'>
              {userInfo && comment.user === userInfo.id ? (
                <>
                  <div className='edit-buttons buttons-disabled'>
                    <i
                      className='fas fa-check-square accept'
                      onClick={() => submitEditComment(comment.id)}></i>
                    <i
                      className='fas fa-minus-square cancel'
                      onClick={() => startStopEditingComment(comment.id)}></i>
                  </div>
                  <div className='owner-buttons'>
                    <i
                      className='fas fa-pen edit'
                      onClick={() => startStopEditingComment(comment.id)}></i>
                    <i
                      className='fas fa-trash delete'
                      onClick={() => commentDeleteHandler(comment.id)}></i>
                  </div>
                </>
              ) : (
                <div className='activities'>
                  <i
                    className={`fas fa-heart like-button ${
                      userInfo &&
                      comment.likes.find(
                        (like: any) => like.user === userInfo.id
                      ) &&
                      'liked'
                    } `}
                    onClick={(e) => likeUnlike(e.target, comment.id)}></i>
                  <span id={`likes-${comment.id}`} className='like-balance'>
                    {comment.likes.length}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span
            id={`comment-input-${comment.id}`}
            className='content comment-content-text'
            onChange={(e) => {
              commentId
                ? editCommentText(e.target, commentId, comment.id)
                : editCommentText(e.target, comment.id);
            }}>
            {comment.higher_author && (
              <span className='higher-author'>@{comment.higher_author}</span>
            )}
            <span className='comment-text'>{comment.text}</span>
          </span>
          <p
            className='respond-button'
            onClick={() => showCommentForm(comment.id)}>
            Odpowiedz
          </p>

          <form
            className='comment-form'
            onSubmit={(e) => {
              commentId
                ? createCommentHandler(
                    e,
                    'comment',
                    commentId,
                    comment.id,
                    comment.author
                  )
                : createCommentHandler(
                    e,
                    'comment',
                    comment.id,
                    0,
                    comment.author
                  );
            }}>
            <div className='form-group'>
              <input
                id={`textBox-${comment.id}`}
                name='comment'
                autoComplete='off'
                placeholder='Napisz komentarz...'
                onClick={() => (!userInfo ? history.push('/login') : '')}
                required
              />
              <div className='line'></div>
            </div>
            <div className={`comment-buttons comment-active`}>
              <button
                className='cancel-button'
                type='reset'
                onClick={() => hideForm(comment.id)}>
                Anuluj
              </button>
              <button
                className='submit-button'
                type='submit'
                onClick={() => hideForm(comment.id)}>
                Skomentuj
              </button>
            </div>
          </form>
        </div>
      </div>
      <Loader />

      {/* Odpowiedzi */}

      {comment.replies &&
        comment.replies
          .sort((a: any, b: any) => {
            return Date.parse(a.date_added) - Date.parse(b.date_added);
          })
          .map((reply: any) => (
            <Comment
              key={reply.id}
              comment={reply}
              commentId={comment.id}
              userInfo={userInfo}
              timeAgo={timeAgo}
              submitEditComment={submitEditComment}
              startStopEditingComment={startStopEditingComment}
              commentDeleteHandler={commentDeleteHandler}
              likeUnlike={likeUnlike}
              editCommentText={editCommentText}
              showCommentForm={showCommentForm}
              createCommentHandler={createCommentHandler}
              hideForm={hideForm}
              isReply={true}
            />
          ))}
    </div>
  );
};

export default Comment;
