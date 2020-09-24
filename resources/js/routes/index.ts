import Home from '../pages/Home';
import Post from '../pages/Post/index';
import Login from '../pages/auth/Login';
import People from '../pages/People';
import Search from '../pages/Search';
import Explore from '../pages/Explore';
import Register from '../pages/auth/Register';
import Notifications from '../pages/account/Notifications/index';
import UserProfile from '../pages/account/UserProfile/index';
import EditProfile from '../pages/account/EditProfile/index';
import NotFound from '../pages/PageNotFound';

const route_map = {
    'post': {
        path: '/post/:id',
        component: Post,
    },
    'login': {
        path: '/login',
        component: Login,
    },
    'activity': {
        path: '/activity',
        component: Notifications,
    },
    'register': {
        path: '/register',
        component: Register,
    },
    'explore': {
        path: ['/explore/search/:query','/explore/search/'],
        component: Search,
    },
    'user': {
        path: '/user/:username',
        component: UserProfile,
    },
    'search': {
        path: '/explore',
        component: Explore,
    },
    'people': {
        path: '/explore/people',
        component: People,
    },
    'accounts': {
        path: '/accounts/edit/:page',
        component: EditProfile,
    },
}


const routes = (path)=>{
    const home = {
        path: '/',
        exact: true,
        component: Home,
    },
        _404 = {
        component: NotFound,
    },
        route_list = Object.values(route_map);

    if (path != '/')
        home.component = route_map[path].component;

    route_list.unshift(home);
    route_list.push(_404 as any);

    return route_list;
};

export default routes;
