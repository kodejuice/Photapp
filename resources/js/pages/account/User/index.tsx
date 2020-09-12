import React, {useState} from 'react';
import Router, {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import useSWR from '../../../helpers/swr';
import {fetchUser, fetchListing} from '../../../helpers/fetcher';
import {limit, amount} from '../../../helpers/util';
import showAlert from '../../../components/Alert/showAlert';
import authUser from '../../../state/auth_user';

import Header from '../../../components/Header';
import Posts from '../../../components/Posts';
import LazyDP from '../../../components/LazyDP';
import FollowButton from '../../../components/FollowButton';
import Spinner from '../../../components/Spinner';
import {ProcessUserInput} from '../../../helpers/mini-components';

import "./styles.scss";


const UserPosts: React.FC<{username:string}> = ({username}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = usePosts(username, 'posts');

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='search-result'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    <div className='home-posts'>
                        {data && <Posts view='grid' data={data}/>}
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}


const UserBookmarks: React.FC<{username:string}> = ({username}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = usePosts(username, 'bookmarks');

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='search-result'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    <div className='home-posts'>
                        {data && <Posts view='grid' data={data}/>}
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}


const UserMentions: React.FC<{username:string}> = ({username}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = usePosts(username, 'mentions');

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='search-result'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    <div className='home-posts'>
                        {data && <Posts view='grid' data={data}/>}
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}




const UserProfile: React.FC<Router.RouteComponentProps> = ({match})=>{
    const dispatch = useDispatch();
    const {logged, user} = authUser();
    const [tab, setTab] = useState(0);

    const params = (match.params as any);
    let {data, isLoading, isError} = useUser(params.username);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        data = null;
    }

    const isSelf = logged && user.username == params.username;

    return (
        <React.Fragment>
            <Header page='profile' hide_icon={true} header_title='Profile' />

            <div className='user-profile'>
                { isLoading && <Spinner />}

                {data && (
                    <React.Fragment>
                        <div className='mobile-profile-head'>
                            <div className='profile-info'>
                                <div className='row info'>
                                    <div className='col-2 dp-col'>
                                        <LazyDP user={data.username} />
                                    </div>
                                    <div className='col-1 hidden-col-dp'></div>
                                    <div className='col-9 username-col'>
                                        <div className='username'>
                                            <p id='username'>{data.username}</p>
                                        </div>
                                        <div className='follow-button'>
                                            <FollowButton user={data.username} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bio'>
                                <p id='full_name'> {data.full_name} </p>
                                <div className='profile-bio'>
                                    <p id='bio'> <ProcessUserInput text={limit(data.bio||"", 250)} /> </p>
                                </div>
                            </div>
                            <div className='stats row'>
                                <div className='col col-fill'> <p id='count'>{amount(data.posts_count)}</p> <div id='w'>posts</div> </div>
                                <div className='col col-fill'> <Link to={`/user/${data.username}/followers`}> <p id='count'>{amount(data.followers)}</p> <div id='w'>followers</div> </Link> </div>
                                <div className='col col-fill'> <Link to={`/user/${data.username}/following`}> <p id='count'>{amount(data.follows)}</p> <div id='w'>following</div> </Link></div>
                            </div>
                        </div>

                        <div className='desktop-profile-head'>
                            <div className='profile-info'>
                                <div className='row info'>
                                    <div className='col col-3 dp-col'>
                                        <LazyDP user={data.username} />
                                    </div>
                                    <div className='col col-1 hidden-col-big'></div>

                                    <div className='col col-fill'>
                                        <div className='row'>
                                            <div className='col col-2'>
                                                <p id='username'>{data.username}</p>
                                            </div>
                                            <div className='col col-1 hidden-col-username'></div>
                                            <div className='col col-4 follow-button'>
                                                <FollowButton user={data.username} />
                                            </div>
                                        </div>

                                        <div className='row stats'>
                                            <div className='col col-3'> <p id='count'>{amount(data.posts_count)}</p> <div id='w'>posts</div> </div>
                                            <div className='col col-3'> <Link to={`/user/${data.username}/followers`}> <p id='count'>{amount(data.followers)}</p> <div id='w'>followers</div> </Link> </div>
                                            <div className='col col-3'> <Link to={`/user/${data.username}/following`}> <p id='count'>{amount(data.follows)}</p> <div id='w'>following</div> </Link></div>
                                        </div>
    
                                        <div className='bio'>
                                            <p id='full_name'> {data.full_name} </p>
                                            <div className='profile-bio'>
                                                <p id='bio'> <ProcessUserInput text={limit(data.bio||"", 250)} /> </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/*TABs*/}

                        <div className='tabs'>
                            <div className="row flex-spaces tabs">
                                <input id="tab1" type="radio" name="tabs" defaultChecked/>
                                <label data-testid="tab1" onClick={()=>setTab(0)} className='title' htmlFor="tab1">
                                    <img id='icon' src='/icon/grid.png'/> <span className='__hide-mobile'>POSTS</span>
                                </label>

                                {isSelf && (
                                <React.Fragment>
                                    <input id="tab2" type="radio" name="tabs"/>
                                    <label data-testid="tab2" onClick={()=>setTab(1)} className='title' htmlFor="tab2">
                                        <img id='icon' src='/icon/bookmark.png'/> <span className='__hide-mobile'>SAVED</span>
                                    </label>
                                </React.Fragment>
                                )}

                                <input id="tab3" type="radio" name="tabs"/>
                                <label data-testid="tab3" onClick={()=>setTab(2)} className='title' htmlFor="tab3">
                                    <img id='icon' src='/icon/tag.png'/> <span className='__hide-mobile'>TAGGED</span>
                                </label>

                                <div className="content" id="content1"> {tab==0 && <UserPosts username={data.username}/>} </div>
                                {isSelf && <div className="content" id="content2"> {tab==1 && <UserBookmarks username={data.username}/>} </div>}
                                <div className="content" id="content3"> {tab==2 && <UserMentions username={data.username}/>} </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>

        </React.Fragment>
    );
};


/**
 * useUser hook
 * @param  string   username
 */
function useUser(user) {
    const { data, error } = useSWR(user, fetchUser);
    return {
        data,
        isLoading: !error && !data,
        isError: error
    }
}


/**
 * get users posts hook
 * @param  {string} username
 */
function usePosts(username, post_category='posts') {
    const {data, error} = useSWR(`/api/user/${username}/${post_category}`, fetchListing);
    return {
        data,
        isError: error,
        isLoading: !data && !error,
    }
}


export default UserProfile;
