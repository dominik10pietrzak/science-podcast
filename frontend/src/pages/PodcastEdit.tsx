import React, { useEffect, useState } from 'react';
import '../styles/user-edit.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getPodcastDetails, updatePodcast } from '../actions/podcastActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';

const PodcastEdit: React.FC<{ match: any; history: any }> = ({
  match,
  history,
}) => {
  const podcastId = match.params.id;

  const dispatch = useDispatch();

  const [title, setTitle] = useState('title');
  const [category, setCategory] = useState('category');
  const [description, setDescription] = useState('description');
  const [cover, setCover] = useState('cover');
  const [background, setBackground] = useState('background');
  const [code, setCode] = useState('code');
  const [uploading, setUploading] = useState(false);

  const { podcast, loading } = useSelector(
    (state: RootStateOrAny) => state.podcastDetails
  );

  const {
    error: errorUpdate,
    success: successUpdate,
    loading: loadingUpdate,
  } = useSelector((state: RootStateOrAny) => state.podcastUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: 'PODCAST_UPDATE_RESET' });
      history.push('/adminpanel');
    } else {
      if (!podcast.title || podcast.id !== Number(podcastId)) {
        dispatch(getPodcastDetails(podcastId));
      } else {
        setTitle(podcast.title);
        setCategory(podcast.category);
        setDescription(podcast.description);
        setCover(podcast.cover);
        setBackground(podcast.background);
        setCode(podcast.code);
      }
    }
    onLoadAnimations();
    return () => onLeaveAnimations();
  }, [dispatch, podcast, podcastId, history, successUpdate]);

  const onLoadAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'black';
  };

  const onLeaveAnimations = () => {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    navbar.style.background = 'transparent';
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updatePodcast({ id: podcast.id, title, description, category, code })
    );
  };

  const uploadFileHandler = (type: string) => async (
    e: React.FormEvent | any
  ) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('podcast_id', podcastId);
    formData.append('type', type);

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post(
        '/api/podcast/upload/',
        formData,
        config
      );

      setCover(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className='podcast-edit'>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          {errorUpdate && <Message>{errorUpdate}</Message>}
          {loadingUpdate && <Loader />}

          <label>Tytu??</label>
          <input
            type='text'
            placeholder='Wprowad?? tytu??'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Kategoria</label>
          <input
            type='text'
            placeholder='Wprowad?? kategori??'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>Kod</label>
          <input
            placeholder='Wprowad?? kod'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <label>Opis</label>
          <textarea
            placeholder='Wprowad?? opis'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <h3 className='heading'>Ok??adka</h3>
          <input
            type='text'
            placeholder='Description'
            value={cover}
            disabled
            onChange={(e) => setCover(e.target.value)}
          />
          <div className='file-form'>
            <input
              type='file'
              placeholder='Description'
              onChange={uploadFileHandler('cover')}
            />
            <button>Zmie?? ok??adk??</button>
          </div>

          <h3 className='heading'>T??o</h3>
          <input
            type='text'
            placeholder='Description'
            value={background}
            disabled
            onChange={(e) => setBackground(e.target.value)}
          />
          <div className='file-form'>
            <input
              type='file'
              placeholder='Description'
              onChange={uploadFileHandler('background')}
            />
            <button>Zmie?? t??o</button>
          </div>

          {uploading && <Loader />}
          <button className='update-button' type='submit'>
            Aktualizuj
          </button>
        </form>
      )}
    </div>
  );
};

export default PodcastEdit;
