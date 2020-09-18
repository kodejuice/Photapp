import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import People from '../pages/People';
import Search from '../pages/Search';
import Explore from '../pages/Explore';
import Register from '../pages/auth/Register';
import Notifications from '../pages/account/Notifications/index';
import UserProfile from '../pages/account/UserProfile/index';
import EditProfile from '../pages/account/EditProfile/index';
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
        path: '/activity',
        component: Notifications,
    },
    {
        path: ['/explore/search/:query','/explore/search/'],
        component: Search,
    },
    {
        path: '/user/:username',
        component: UserProfile,
    },
    {
        path: '/accounts/edit/:page',
        component: EditProfile,
    },
    {
        path: '/explore/people',
        component: People,
    },
    {
        path: '/explore',
        component: Explore,
    },
    {
        component: NotFound
    }
]

export default routes;
