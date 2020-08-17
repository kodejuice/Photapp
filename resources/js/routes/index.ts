import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import NotFound from '../components/NotFound';

// import {Route} from 'react-router';


const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    component: NotFound
  }
]

export default routes;
