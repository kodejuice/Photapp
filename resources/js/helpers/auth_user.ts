import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {userProfile as profileObject} from '../state/userProfile.d';

export default function authUser() {
    const logged = useSelector<RootState, boolean>(({isLogged}) => isLogged);
    const user = useSelector<RootState, profileObject>(({userProfile}) => userProfile);

    return {logged, user};
}
