export const podcastListReducer = (state = { podcasts: [] }, action: any) => {
  switch (action.type) {
    case 'PODCAST_LIST_REQUEST':
      return { loading: true, podcasts: [] };

    case 'PODCAST_LIST_SUCCESS':
      return {
        loading: false,
        podcasts: action.payload.podcasts,
        page: action.payload.page,
        pages: action.payload.pages,
      };

    case 'PODCAST_LIST_FAIL':
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const podcastDetailsReducer = (state = { podcast: {} }, action: any) => {
  switch (action.type) {
    case 'PODCAST_DETAILS_REQUEST':
      return { ...state, loading: true };

    case 'PODCAST_DETAILS_SUCCESS':
      return {
        loading: false,
        podcast: action.payload,
      };

    case 'PODCAST_DETAILS_FAIL':
      return { loading: false, error: action.payload };

    case 'PODCAST_DETAILS_RESET':
      return { podcast: {} };

    default:
      return state;
  }
};

export const podcastCommentCreateReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'PODCAST_CREATE_COMMENT_REQUEST':
      return { loading: true, comment: {} };

    case 'PODCAST_CREATE_COMMENT_SUCCESS':
      return {
        loading: false,
        podcast: action.payload,
      };

    case 'PODCAST_CREATE_COMMENT_FAIL':
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const podcastCreateReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'PODCAST_CREATE_REQUEST':
      return { loading: true };

    case 'PODCAST_CREATE_SUCCESS':
      return { loading: false, success: true, podcast: action.payload };

    case 'PODCAST_CREATE_FAIL':
      return { loading: false, error: action.payload };

    case 'PODCAST_CREATE_RESET':
      return {};

    default:
      return state;
  }
};

export const podcastDeleteReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'PODCAST_DELETE_REQUEST':
      return { loading: true };

    case 'PODCAST_DELETE_SUCCESS':
      return { loading: false, success: true };

    case 'PODCAST_DELETE_FAIL':
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const podcastUpdateReducer = (state = { podcast: {} }, action: any) => {
  switch (action.type) {
    case 'PODCAST_UPDATE_REQUEST':
      return { loading: true };

    case 'PODCAST_UPDATE_SUCCESS':
      return { loading: false, success: true, podcast: action.payload };

    case 'PODCAST_UPDATE_FAIL':
      return { loading: false, success: false };

    case 'PODCAST_UPDATE_RESET':
      return { podcast: {} };

    default:
      return state;
  }
};
