import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/PageNotFound';


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
