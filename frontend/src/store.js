import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  podcastCommentCreateReducer,
  podcastDetailsReducer,
  podcastListReducer,
  podcastDeleteReducer,
  podcastUpdateReducer,
  podcastCreateReducer,
} from './reducers/podcastReducers';
import {
  commentDeleteReducer,
  commentsListReducer,
} from './reducers/commentReducers';
import { commentCreateReducer } from './reducers/commentReducers';
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from './reducers/userReducers';

const reducer = combineReducers({
  //productReducers
  podcastList: podcastListReducer,
  podcastDetails: podcastDetailsReducer,
  podcastCommentCreate: podcastCommentCreateReducer,
  podcastDelete: podcastDeleteReducer,
  podcastUpdate: podcastUpdateReducer,
  podcastCreate: podcastCreateReducer,

  //commmentReducers
  commentsList: commentsListReducer,
  commentCreate: commentCreateReducer,
  commentDelete: commentDeleteReducer,

  //userReducers
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUpdateProfile: userUpdateProfileReducer,
});

const userInfoFromStorage = localStorage.getItem('podcastUserInfo')
  ? JSON.parse(localStorage.getItem('podcastUserInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
