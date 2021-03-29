import axios from 'axios';

export const getPodcasts = (keyword = '') => async (dispatch: Function) => {
  try {
    dispatch({ type: 'PODCAST_LIST_REQUEST' });

    const { data } = await axios.get(`/api/podcast/${keyword}`);

    dispatch({ type: 'PODCAST_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'PODCAST_LIST_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getPodcastDetails = (id: number) => async (dispatch: Function) => {
  try {
    dispatch({ type: 'PODCAST_DETAILS_REQUEST' });

    const { data } = await axios.get(`/api/podcast/${id}`);

    dispatch({ type: 'PODCAST_DETAILS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'PODCAST_DETAILS_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createPodcastComment = (
  podcastId: number,
  comment: string
) => async (dispatch: Function, getState: Function) => {
  try {
    dispatch({
      type: 'PODCAST_CREATE_COMMENT_REQUEST',
    });

    const {
      userLogin: { podcastUserInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${podcastUserInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/podcast/${podcastId}/create-comment/`,
      { comment },
      config
    );

    dispatch({
      type: 'PODCAST_CREATE_COMMENT_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'PODCAST_CREATE_COMMENT_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createPodcast = () => async (
  dispatch: Function,
  getState: Function
) => {
  try {
    dispatch({
      type: 'PODCAST_CREATE_REQUEST',
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

    const { data } = await axios.post(`/api/podcast/create/`, {}, config);
    dispatch({
      type: 'PODCAST_CREATE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'PODCAST_CREATE_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updatePodcast = (podcast: any) => async (
  dispatch: Function,
  getState: Function
) => {
  try {
    dispatch({
      type: 'PODCAST_UPDATE_REQUEST',
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

    const { data } = await axios.put(
      `/api/podcast/update/${podcast.id}/`,
      podcast,
      config
    );

    dispatch({
      type: 'PODCAST_UPDATE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'PODCAST_UPDATE_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deletePodcast = (id: number) => async (
  dispatch: Function,
  getState: Function
) => {
  try {
    dispatch({
      type: 'PODCAST_DELETE_REQUEST',
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

    await axios.delete(`/api/podcast/delete/${id}/`, config);

    dispatch({
      type: 'PODCAST_DELETE_SUCCESS',
    });
  } catch (error) {
    dispatch({
      type: 'PODCAST_DELETE_FAIL',
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
