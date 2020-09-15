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

import UserFollow from './user_follows';

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
            <div className='profile-posts'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    {data && <Posts view='tile' data={data}/>}
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
            <div className='profile-posts'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    {data && <Posts view='tile' data={data}/>}
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
            <div className='profile-posts'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    {data && <Posts view='tile' data={data}/>}
                </div>
            </div>

        </React.Fragment>
    );
}




const UserProfile: React.FC<Router.RouteComponentProps> = ({match, location})=>{
    const dispatch = useDispatch();
    const {logged, user} = authUser();
    const params = (match.params as any);

    const query = new URLSearchParams(location.search);
    const [tab, setTab] = useState<0|1|2>(query.get('tab')=='saved' ? 1 : 0);

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
                                            {logged && !isSelf && <FollowButton user={data.username} unfollow={data.auth_user_follows} />}
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
                                <div className='col col-fill'> <p id='count'>{amount(data.followers)}</p> <label htmlFor="modal-followers"><div id='w'>followers</div></label> </div>
                                <div className='col col-fill'> <p id='count'>{amount(data.follows)}</p> <label htmlFor="modal-following"><div id='w'>following</div></label></div>
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
                                                {logged && !isSelf && <FollowButton user={data.username} unfollow={data.auth_user_follows}/>}
                                            </div>
                                        </div>

                                        <div className='row stats'>
                                            <div className='col col-3'> <p id='count'>{amount(data.posts_count)}</p> <div id='w'>posts</div> </div>
                                            <div className='col col-3'> <p id='count'>{amount(data.followers)}</p> <label  htmlFor="modal-followers"><div id='w'>followers</div></label></div>
                                            <div className='col col-3'> <p id='count'>{amount(data.follows)}</p> <label htmlFor="modal-following"><div id='w'>following</div></label> </div>
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
                                <input id="tab1" type="radio" name="tabs" defaultChecked={tab==0}/>
                                <label data-testid="tab1" onClick={()=>setTab(0)} className='title' htmlFor="tab1">
                                    <img id='icon' src='/icon/grid.png'/> <span className='__hide-mobile'>POSTS</span>
                                </label>

                                {isSelf && (
                                <React.Fragment>
                                    <input id="tab2" type="radio" name="tabs" defaultChecked={tab==1}/>
                                    <label data-testid="tab2" onClick={()=>setTab(1)} className='title' htmlFor="tab2">
                                        <img id='icon' src='/icon/bookmark.png'/> <span className='__hide-mobile'>SAVED</span>
                                    </label>
                                </React.Fragment>
                                )}

                                <input id="tab3" type="radio" name="tabs" defaultChecked={tab==2}/>
                                <label data-testid="tab3" onClick={()=>setTab(2)} className='title' htmlFor="tab3">
                                    <img id='icon' src='/icon/tag.png'/> <span className='__hide-mobile'>TAGGED</span>
                                </label>

                                <div className="content" id="content1"> {tab==0 && <UserPosts username={data.username}/>} </div>
                                {isSelf && <div className="content" id="content2"> {tab==1 && <UserBookmarks username={data.username}/>} </div>}
                                <div className="content" id="content3"> {tab==2 && <UserMentions username={data.username}/>} </div>
                            </div>
                        </div>


                        {/* MODALS */}

                        {data.followers && (
                            <div>
                            <input className="modal-state" id="modal-followers" type="checkbox"/>
                            <div className="modal">
                                <label className="modal-bg" htmlFor="modal-followers"></label>
                                <div className="modal-body">
                                    <label className="btn-close" htmlFor="modal-followers">X</label>
                                    <div className='row'>
                                        <div className='col col-1' style={{padding: '0'}}></div>
                                        <div className='page-title'> {`${data.username} followers`} </div>
                                    </div>
                                    <UserFollow type='followers' username={data.username} />
                                </div>
                            </div>
                            </div>
                        ) || ""}

                        {data.follows && (
                            <div>
                            <input className="modal-state" id="modal-following" type="checkbox"/>
                            <div className="modal">
                                <label className="modal-bg" htmlFor="modal-following"></label>
                                <div className="modal-body">
                                    <label className="btn-close" htmlFor="modal-following">X</label>
                                    <div className='row'>
                                        <div className='col col-1' style={{padding: '0'}}></div>
                                        <div className='page-title'> {`${data.username} following`} </div>
                                    </div>
                                    <UserFollow type='following' username={data.username} />
                                </div>
                            </div>
                            </div>
                        ) || ""}

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
    const {data, error} = useSWR(`/api/user/${username}/${post_category}?limit=200`, fetchListing);
    return {
        data,
        isError: error,
        isLoading: !data && !error,
    }
}


export default UserProfile;
