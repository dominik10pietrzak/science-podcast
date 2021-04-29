import axios from 'axios';
import { RootStateOrAny } from 'react-redux';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IPodcast } from '../functions/interfaces';

const PODCAST_LIST_REQUEST = 'PODCAST_LIST_REQUEST';

export interface GetPodcastsRequestAction
  extends Action<typeof PODCAST_LIST_REQUEST> {}

const PODCAST_LIST_SUCCESS = 'PODCAST_LIST_SUCCESS';

export interface GetPodcastsSuccessAction
  extends Action<typeof PODCAST_LIST_SUCCESS> {
  payload: {
    podcasts: IPodcast[];
  };
}

const PODCAST_LIST_FAILURE = 'PODCAST_LIST_FAILURE';

export interface GetPodcastsFailureAction
  extends Action<typeof PODCAST_LIST_FAILURE> {
  payload: {
    error: any;
  };
}

export const getPodcasts = (
  keyword: string = ''
): ThunkAction<
  void,
  RootStateOrAny,
  undefined,
  GetPodcastsRequestAction | GetPodcastsSuccessAction | GetPodcastsFailureAction
> => async (dispatch) => {
  try {
    dispatch({ type: PODCAST_LIST_REQUEST });

    const { data } = await axios.get(`/api/podcast/${keyword}`);
    console.log(data.results);

    dispatch({
      type: PODCAST_LIST_SUCCESS,
      payload: { podcasts: data.results },
    });
  } catch (error) {
    dispatch({
      type: PODCAST_LIST_FAILURE,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getPodcastDetails = (
  id: number
): ThunkAction<void, RootStateOrAny, undefined, Action> => async (dispatch) => {
  try {
    dispatch({ type: 'PODCAST_DETAILS_REQUEST' });

    const { data } = await axios.get(`/api/podcast/${id}`);
    console.log(data);

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
): ThunkAction<void, RootStateOrAny, undefined, Action> => async (
  dispatch,
  getState
) => {
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

export const createPodcast = (): ThunkAction<
  void,
  RootStateOrAny,
  undefined,
  Action
> => async (dispatch, getState) => {
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

export const updatePodcast = (
  podcast: any
): ThunkAction<void, RootStateOrAny, undefined, Action> => async (
  dispatch,
  getState
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

export const deletePodcast = (
  id: number
): ThunkAction<void, RootStateOrAny, undefined, Action> => async (
  dispatch,
  getState
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
