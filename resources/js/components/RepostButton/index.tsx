import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {repostUserPost} from '../../helpers/fetcher';

import showAlert from '../Alert/showAlert';


type RepostButtonProps = {
    post_id: number,
    username: string,
}


const RepostButton: React.FC<RepostButtonProps> = ({post_id, username}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);

    const unmounted = useRef<boolean>(false);
    useEffect(()=>{
        unmounted.current = false;
        return () => {unmounted.current = true;}
    });

    const isUnmounted = unmounted.current;

    const rePost = ()=>{
        if (!confirm(`Repost @${username}'s post`)) return;
        setLoading(true);

        repostUserPost(post_id)
        .then(res => {
            if (isUnmounted) return;
            if (res?.errors) return showAlert(dispatch, res?.errors);
            if (!res?.success) return;
            showAlert(dispatch, ['Reposted!'], 'success');
        })
        .catch(()=>{})
        .finally(()=>{
            if (isUnmounted) return;
            setLoading(false)
        });
    }

    return (
        <button onClick={rePost}> {isLoading ? loading : "Repost"} </button>
    );
}



export default RepostButton;
