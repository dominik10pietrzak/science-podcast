import axios from 'axios';

export const getComments = (id: number, reload?: boolean) => async (
  dispatch: Function
) => {
  try {
    if (reload) {
      dispatch({ type: 'PODCAST_COMMENTS_LIST_REQUEST' });
    }

    const { data } = await axios.get(`/api/podcast/${id}/comments`);

    dispatch({ type: 'PODCAST_COMMENTS_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'PODCAST_COMMENTS_LIST_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createComment = (
  podcastId: number,
  type: string,
  text: string,
  commentId: number = 0,
  replyId: number = 0,
  author: string = ''
) => async (dispatch: Function, getState: Function) => {
  try {
    dispatch({
      type: 'COMMENT_CREATE_REQUEST',
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/podcast/${podcastId}/create_comment/`,
      { text, type, commentId, replyId, author },
      config
    );
    dispatch({
      type: 'COMMENT_CREATE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'COMMENT_CREATE_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteComment = (commentId: number) => async (
  dispatch: Function,
  getState: Function
) => {
  try {
    dispatch({
      type: 'COMMENT_DELETE_REQUEST',
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(
      `/api/podcast/${commentId}/delete_comment/`,
      config
    );
    dispatch({
      type: 'COMMENT_DELETE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'COMMENT_DELETE_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
