import React, { useEffect, useState } from 'react';
import '../styles/comments.scss';
import TimeAgo from 'javascript-time-ago';
import pl from 'javascript-time-ago/locale/pl';
import Loader from '../components/Loader';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getComments, createComment } from '../actions/commentActions';
import axios from 'axios';
import Confirm from './Confirm';
import { useHistory } from 'react-router-dom';

import Comment from './Comment';
import { activatePastePermission } from '../functions/commentFunctions';

const Comments: React.FC<{ podcastId: number }> = ({ podcastId }) => {
  const [commentText, setCommentText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(0);
  const [confirm, setConfirm] = useState(false);

  TimeAgo.addLocale(pl);
  const timeAgo = new TimeAgo('pl-PL');
  timeAgo.format(new Date());

  const dispatch = useDispatch();
  const history = useHistory();

  const { userInfo } = useSelector((state: RootStateOrAny) => state.userLogin);

  const { comments, loading } = useSelector(
    (state: RootStateOrAny) => state.commentsList
  );

  const { success: commentDeleteSuccess } = useSelector(
    (state: RootStateOrAny) => state.commentDelete
  );

  const { success: commentCreateSuccess } = useSelector(
    (state: RootStateOrAny) => state.commentCreate
  );

  useEffect(() => {
    if (commentCreateSuccess || commentDeleteSuccess) {
      setCommentText('');
    }
    dispatch(getComments(podcastId));
  }, [dispatch, podcastId, commentCreateSuccess, commentDeleteSuccess]);

  const createCommentHandler = async (
    e: React.FormEvent,
    type: string,
    commentId: number = 0,
    replyId: number = 0,
    author: string = ''
  ) => {
    e.preventDefault();

    if (!userInfo) {
      return;
    }

    let targetId: string;
    let loaderId: string;
    if (replyId) {
      targetId = `textBox-${replyId}`;
      loaderId = `#comment-${replyId} .loader`;
    } else if (commentId) {
      targetId = `textBox-${commentId}`;
      loaderId = `#comment-${commentId} .loader`;
    } else {
      targetId = 'textBox';
      loaderId = `.comments .loader`;
    }

    const input = document.getElementById(targetId) as HTMLInputElement;
    let loader = document.querySelector(loaderId) as HTMLElement;

    loader.classList.add('loader-visible');

    await dispatch(
      createComment(podcastId, type, input.value, commentId, replyId, author)
    );
    await dispatch(getComments(podcastId, false));
    loader.classList.remove('loader-visible');

    input.value = '';
  };

  const commentDeleteHandler = async (commentId: number) => {
    setCommentToDelete(commentId);
    const confirm = document.querySelector('.confirm') as HTMLElement;
    confirm.style.display = 'flex';
  };

  const hideForm = (commentId: number) => {
    setCommentText('');

    const commentForm = document.querySelector(
      `#comment-${commentId} .comment-form`
    ) as HTMLElement;

    commentForm.style.display = 'none';
  };

  const showCommentForm = (commentId: number) => {
    const commentForm = document.querySelector(
      `#comment-${commentId} .comment-form`
    ) as HTMLElement;

    commentForm.style.display = 'flex';
  };

  const likeUnlike = async (comment: any, commentId: number) => {
    if (!userInfo) {
      history.push('/login');
      return;
    }

    const likeButton = comment as HTMLElement;

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        data: {
          type: 'comment',
        },
      };
      const likes = document.getElementById(`likes-${commentId}`) as any;
      const isLiked = likeButton.classList.contains('liked');

      if (isLiked) {
        await axios.delete(
          `/api/podcast/comments/${commentId}/unlike/`,
          config
        );
        likes.innerText = Number(likes.innerText) - 1;
      } else {
        await axios.post(
          `/api/podcast/comments/${commentId}/like/`,
          { type: 'comment' },
          config
        );
        likes.innerText = Number(likes.innerText) + 1;
      }

      likeButton.classList.toggle('liked');
    } catch (error) {
      console.log(error);
    }
  };

  const buttonsToggle = (commentId: number) => {
    const editButtons = document.querySelector(
      `#comment-${commentId} .comment-user-functions .edit-buttons`
    ) as HTMLElement;
    const onwerButtons = document.querySelector(
      `#comment-${commentId} .comment-user-functions .owner-buttons`
    ) as HTMLElement;
    const commentValue = document.getElementById(
      `comment-input-${commentId}`
    ) as HTMLInputElement;

    editButtons.classList.toggle('buttons-disabled');
    onwerButtons.classList.toggle('buttons-disabled');
    commentValue.classList.toggle('editable');
  };

  const startStopEditingComment = async (commentId: number) => {
    buttonsToggle(commentId);

    const commentValue = document.getElementById(
      `comment-input-${commentId}`
    ) as HTMLInputElement;

    if (commentValue.contentEditable === 'true') {
      commentValue.contentEditable = 'false';
      await dispatch(getComments(podcastId, false));
    } else {
      commentValue.contentEditable = 'true';
    }
  };

  const editCommentText = (
    content: any,
    commentId: number,
    replyId?: number
  ) => {
    const commentsUpdated = comments;
    const comment = commentsUpdated.find(
      (comment: any) => comment.id === commentId
    );
    if (replyId) {
      comment.replies.find((reply: any) => reply.id === replyId).text =
        content.value;
    } else {
      comment.text = content.value;
    }
    dispatch({
      type: 'PODCAST_COMMENTS_LIST_SUCCESS',
      payload: commentsUpdated,
    });
  };

  const submitEditComment = async (commentId: number) => {
    const comment = document.getElementById(
      `comment-input-${commentId}`
    ) as HTMLElement;
    const commentText = document.querySelector(
      `#comment-input-${commentId} .comment-text`
    ) as HTMLElement;

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/podcast/comments/${commentId}/update/`,
        { text: commentText.innerText },
        config
      );
      buttonsToggle(commentId);
      comment.contentEditable = 'false';
      await dispatch(getComments(podcastId, false));
    } catch (error) {
      console.log(error);
    }
  };

  return comments ? (
    <div className='comments'>
      {activatePastePermission()}
      <Confirm commentToDelete={commentToDelete} />
      {comments && comments.length === 0 ? (
        <h3 className='section-title'>Nie ma jeszcze żadnych komentarzy</h3>
      ) : (
        <h3 className='section-title'>Komentarze</h3>
      )}
      <form
        className='comment-form'
        onSubmit={(e) => createCommentHandler(e, 'podcast')}>
        <div className='form-group'>
          <input
            id='textBox'
            name='comment'
            value={commentText}
            autoComplete='off'
            onChange={(e) => setCommentText(e.target.value)}
            onClick={() => (!userInfo ? history.push('/login') : '')}
            placeholder='Napisz komentarz...'
            required
          />
          <div className='line'></div>
        </div>
        <div className={`comment-buttons comment-active`}>
          <button
            className='cancel-button'
            type='reset'
            onClick={() => setCommentText('')}>
            Anuluj
          </button>
          <button className='submit-button' type='submit'>
            Skomentuj
          </button>
        </div>
      </form>
      <Loader />

      {/* Komentarze */}

      <div className='comments-list'>
        {comments.map((comment: any) => (
          <Comment
            key={comment.id}
            comment={comment}
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
          />
        ))}
      </div>
    </div>
  ) : loading ? (
    <Loader />
  ) : null;
};

export default Comments;
