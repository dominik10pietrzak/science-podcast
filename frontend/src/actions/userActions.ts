import axios from 'axios';

export const login =
  (username: string, password: string) => async (dispatch: Function) => {
    try {
      dispatch({
        type: 'USER_LOGIN_REQUEST',
      });

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/login/',
        { username, password },
        config
      );

      setTimeout(() => {
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
      }, 1000);

      localStorage.setItem('podcastUserInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: 'USER_LOGIN_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const logout = () => async (dispatch: Function) => {
  localStorage.removeItem('podcastUserInfo');

  dispatch({
    type: 'USER_LOGOUT',
  });
};

export const register =
  (name: string, email: string, password: string) =>
  async (dispatch: Function) => {
    try {
      dispatch({
        type: 'USER_REGISTER_REQUEST',
      });

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/register/',
        { name: name, email: email, password: password },
        config
      );

      dispatch({ type: 'USER_REGISTER_SUCCESS', payload: data });

      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });

      localStorage.setItem('podcastUserInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: 'USER_REGISTER_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const getUserDetails =
  (id: number | string) => async (dispatch: Function, getState: Function) => {
    try {
      dispatch({
        type: 'USER_DETAILS_REQUEST',
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

      const { data } = await axios.get(`/api/users/${id}/`, config);

      dispatch({ type: 'USER_DETAILS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'USER_DETAILS_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updateUserProfile =
  (user: any) => async (dispatch: Function, getState: Function) => {
    try {
      dispatch({
        type: 'USER_UPDATE_PROFILE_REQUEST',
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
        `/api/users/profile/update/`,
        user,
        config
      );

      dispatch({ type: 'USER_UPDATE_PROFILE_SUCCESS', payload: data });

      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });

      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: 'USER_UPDATE_PROFILE_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const listUsers =
  () => async (dispatch: Function, getState: Function) => {
    try {
      dispatch({
        type: 'USER_LIST_REQUEST',
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

      const { data } = await axios.get(`/api/users/`, config);

      dispatch({
        type: 'USER_LIST_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'USER_LIST_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const deleteUser =
  (id: number) => async (dispatch: Function, getState: Function) => {
    try {
      dispatch({
        type: 'USER_DELETE_REQUEST',
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

      const { data } = await axios.delete(`/api/users/delete/${id}/`, config);

      dispatch({
        type: 'USER_DELETE_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'USER_DELETE_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updateUser =
  (user: any) => async (dispatch: Function, getState: Function) => {
    try {
      dispatch({
        type: 'USER_UPDATE_REQUEST',
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
        `/api/users/update/${user.id}/`,
        user,
        config
      );

      dispatch({
        type: 'USER_UPDATE_SUCCESS',
      });

      dispatch({
        type: 'USER_DETAILS_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'USER_UPDATE_FAIL',
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
