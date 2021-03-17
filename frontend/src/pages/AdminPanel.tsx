import { useEffect } from 'react';
import '../styles/admin-panel.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';

import { listUsers } from '../actions/userActions';
import Loader from '../components/Loader';
import {
  createPodcast,
  deletePodcast,
  getPodcasts,
} from '../actions/podcastActions';
import { Link } from 'react-router-dom';
import { deleteUser } from '../actions/userActions';

const AdminPanel: React.FC<{ history: any }> = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state: RootStateOrAny) => state.userLogin);
  const { userInfo } = userLogin;

  const { podcasts, loading: podcastsLoading } = useSelector(
    (state: RootStateOrAny) => state.podcastList
  );

  const { loading: usersLoading, users } = useSelector(
    (state: RootStateOrAny) => state.userList
  );

  const { success: successUserDelete } = useSelector(
    (state: RootStateOrAny) => state.userDelete
  );

  const { success: successPodcastDelete } = useSelector(
    (state: RootStateOrAny) => state.podcastDelete
  );

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    podcast: createdPodcast,
  } = useSelector((state: RootStateOrAny) => state.podcastCreate);

  let keyword = history.location.search;
  useEffect(() => {
    dispatch({ type: 'PODCAST_CREATE_RESET' });

    if (successCreate) {
      history.push(`/admin/podcastlist/${createdPodcast.id}/edit`);
    } else {
      dispatch(getPodcasts(keyword));
    }

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    } else {
      dispatch(listUsers());
      dispatch(getPodcasts());
    }

    onLoadAnimations();
    return () => {
      onLeaveAnimations();
    };
  }, [
    dispatch,
    history,
    keyword,
    userInfo,
    successPodcastDelete,
    successUserDelete,
    successCreate,
    createdPodcast,
  ]);

  const onLoadAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'black';
  };

  const onLeaveAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'transparent';
  };

  const podcastDeleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      dispatch(deletePodcast(id));
    }
  };

  const userDeleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const createPodcastHandler = () => {
    dispatch(createPodcast());
  };

  const showPanel = () => {
    const panel = document.querySelector('.admin-panel') as HTMLElement;

    panel &&
      setTimeout(() => {
        panel.classList.remove('admin-panel-hidden');
      }, 15);
  };

  return (
    <div className='admin-panel admin-panel-hidden'>
      {podcastsLoading || usersLoading ? (
        <Loader />
      ) : (
        <>
          {showPanel()}
          <h1>Panel Administratora</h1>
          <div className='admin_users-list list-container'>
            <div className='topbar'>
              <h3>Użytkownicy</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USERNAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th>EDYCJA</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user: any) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.isAdmin ? (
                          <i
                            className='fas fa-check'
                            style={{ color: 'green' }}></i>
                        ) : (
                          <i
                            className='fas fa-times'
                            style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        <Link to={`/admin/userlist/${user.id}/edit`}>
                          <button>
                            <i className='fas fa-edit edit'></i>
                          </button>
                        </Link>
                        <button onClick={() => userDeleteHandler(user.id)}>
                          <i className='fas fa-trash delete'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className='admin_podcasts-list list-container'>
            <div className='topbar'>
              <h3>Podcasty</h3>
              <button className='adding-button' onClick={createPodcastHandler}>
                Dodaj nowy podcast +
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TYTUŁ</th>
                  <th>KATEGORIA</th>
                  <th>EDYCJA</th>
                </tr>
              </thead>
              <tbody>
                {podcasts &&
                  podcasts.map((podcast: any) => (
                    <tr key={podcast.id}>
                      <td>{podcast.id}</td>
                      <td>
                        <Link to={`/podcast/${podcast.id}`}>
                          {podcast.title}
                        </Link>
                      </td>
                      <td>{podcast.category}</td>
                      <td>
                        <Link to={`/admin/podcastlist/${podcast.id}/edit`}>
                          <button>
                            <i className='fas fa-edit edit'></i>
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            podcastDeleteHandler(podcast.id);
                          }}>
                          <i className='fas fa-trash delete'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
