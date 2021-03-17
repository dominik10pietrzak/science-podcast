import './App.scss';

import { Route, Switch } from 'react-router';

//components
import Navbar from './components/navbar';
import Footer from './components/footer';

//pages
import Contact from './pages/contact';
import Weather from './pages/weather';
import Register from './pages/Register';
import UserPanel from './pages/UserPanel';
import Login from './pages/Login';
import PodcastList from './pages/PodcastList';
import AdminPanel from './pages/AdminPanel';
import UserEdit from './pages/UserEdit';
import PodcastEdit from './pages/PodcastEdit';
import Podcast from './pages/podcast';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route exact path='/podcast' component={PodcastList} />
        <Route exact path='/podcast/:id' component={Podcast} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path='/weather' component={Weather} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/user' component={UserPanel} />
        <Route exact path='/adminpanel' component={AdminPanel} />
        <Route exact path='/admin/userlist/:id/edit' component={UserEdit} />
        <Route
          exact
          path='/admin/podcastlist/:id/edit'
          component={PodcastEdit}
        />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
