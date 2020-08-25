import {useSelector} from 'react-redux';
import {RootState} from './store';
import {userProfile as profileObject} from './userProfile.d';

/**
 * Return user information stored in redux
 */

export default function authUser() {
    const logged = useSelector<RootState, boolean>(({isLogged}) => isLogged);
    const user = useSelector<RootState, profileObject>(({userProfile}) => userProfile);

    return {logged, user};
}
