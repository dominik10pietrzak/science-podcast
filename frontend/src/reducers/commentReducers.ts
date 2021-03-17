export const commentsListReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'PODCAST_COMMENTS_LIST_REQUEST':
      return { loading: true, comments: [] };

    case 'PODCAST_COMMENTS_LIST_SUCCESS':
      return {
        loading: false,
        comments: action.payload,
      };

    case 'PODCAST_COMMENTS_LIST_FAIL':
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const commentUpdateReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'COMMENT_DELETE_REQUEST':
      return { loading: true };

    case 'COMMENT_DELETE_SUCCESS':
      return { loading: false, success: true };

    case 'COMMENT_DELETE_FAIL':
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const commentCreateReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'COMMENT_CREATE_REQUEST':
      return { loading: true };

    case 'COMMENT_CREATE_SUCCESS':
      return { loading: false, success: true, podcast: action.payload };

    case 'COMMENT_CREATE_FAIL':
      return { loading: false, error: action.payload };

    case 'COMMENT_CREATE_RESET':
      return {};

    default:
      return state;
  }
};

export const commentDeleteReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'COMMENT_DELETE_REQUEST':
      return { loading: true };

    case 'COMMENT_DELETE_SUCCESS':
      return { loading: false, success: true };

    case 'COMMENT_DELETE_FAIL':
      return { loading: false, success: false };

    default:
      return state;
  }
};
