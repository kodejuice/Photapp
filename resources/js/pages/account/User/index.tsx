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

import {EditProfileModal, LogoutModal} from './edit_profile_modal';
import UserFollow from './user_follows';

import "./styles.scss";

const SettingsIcons = <svg aria-label="Options" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z" fillRule="evenodd"></path></svg>;


const UserPosts: React.FC<{username:string, type: 'posts'|'mentions'|'bookmarks'}> = ({username, type}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = usePosts(username, type);

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='profile-posts' role={type}>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='user-posts' className='user-posts'>
                    {data && <Posts view='tile' data={data.slice()}/>}
                    {data && !data.length && <div style={{textAlign:'center'}}>Nothing here!</div>}
                </div>
            </div>

        </React.Fragment>
    );
}


const UserProfile: React.FC<Router.RouteComponentProps> = ({match, location})=>{
    const dispatch = useDispatch();
    const params = (match.params as any);
    const {logged, user} = authUser();
    const isSelf = logged && user.username == params.username;

    const query = new URLSearchParams(location.search);
    const [tab, setTab] = useState<0|1|2>((isSelf && query.get('tab')=='saved') ? 1 : 0);
                            // 0 -> Posts, 1 -> Saved, 2 -> Tagged

    let {data, isLoading, isError} = useUser(params.username);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        data = null;
    }


    return (
        <React.Fragment>
            <Header page='profile' hide_icon={true} header_title='Profile' />

            <div className='user-profile' role='user-profile'>
                { isLoading && <Spinner />}

                {data && (
                    <React.Fragment>

                        {/*mobile*/}
                        <div className='mobile-profile-head' role='user-profile-sm'>
                            <div className='profile-info'>
                                <div className='row info'>
                                    <div className='col-2 dp-col'>
                                        <LazyDP user={data.username} />
                                    </div>
                                    <div className='col-1 hidden-col-dp'></div>
                                    <div className='col-9 username-col'>
                                        <div className='username'>
                                            <p id='username'>
                                                {data.username}
                                                {isSelf && <label htmlFor='modal-editprofile'><span className='settings-icon-mobile'> {SettingsIcons} </span> </label>}
                                            </p>
                                        </div>
                                        <div className='follow-button'>
                                            {logged && !isSelf && <FollowButton user={data.username} unfollow={data.auth_user_follows} />}
                                            {isSelf && <Link to="/accounts/edit"><button className='edit-profile'>Edit Profile</button></Link>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bio'>
                                <p id='full_name'> {data.full_name}</p>
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

                        {/*desktop*/}
                        <div className='desktop-profile-head' role='user-profile-bg'>
                            <div className='profile-info'>
                                <div className='row info'>
                                    <div className='col col-3 dp-col'>
                                        <LazyDP user={data.username} />
                                    </div>
                                    <div className='col col-1 hidden-col-big'></div>

                                    <div className='col col-fill'>
                                        <div className='row'>
                                            <div className='col col-3'>
                                                <p id='username'>{limit(data.username, 15)}</p>
                                            </div>
                                            <div className='col col-1 hidden-col-username'></div>
                                            <div className='col col-7 follow-button'>
                                                {logged && !isSelf && <FollowButton user={data.username} unfollow={data.auth_user_follows}/>}
                                                {isSelf && <Link to="/accounts/edit"><button className='edit-profile'>Edit Profile</button></Link>}
                                                {isSelf && <label htmlFor='modal-editprofile'><div className='settings-icon'> {SettingsIcons} </div> </label>}
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

                                <div className="content" id="content1"> {tab==0 && <UserPosts type='posts' username={data.username}/>} </div>
                                {isSelf && <div className="content" id="content2"> {tab==1 && <UserPosts type='bookmarks' username={data.username}/>} </div>}
                                <div className="content" id="content3"> {tab==2 && <UserPosts type='mentions' username={data.username}/>} </div>
                            </div>
                        </div>


                        {/* MODALS */}
                        {data.followers && (
                            <React.Fragment>
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
                            </React.Fragment>
                        ) || ""}

                        {data.follows && (
                            <React.Fragment>
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
                            </React.Fragment>
                        ) || ""}

                        {isSelf && (
                            <React.Fragment>
                                <EditProfileModal />

                                <LogoutModal />
                            </React.Fragment>
                        )}

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
    const {data, error} = useSWR(`/api/user/${username}/${post_category}?limit=1000`, fetchListing);
    return {
        data,
        isError: error,
        isLoading: !data && !error,
    }
}


export default UserProfile;
