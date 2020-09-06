import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import Router from 'react-router';
import useSWR from '../helpers/swr';
import {fetchListing} from '../helpers/fetcher';

import Header from '../components/Header';
import Spinner from '../components/Spinner';
import showAlert from '../components/Alert/showAlert';
import Suggestions from '../components/Suggestions';
import Posts from '../components/Posts';
import Users from '../components/Users';


/**
 * posts search result component
 * @param  {string} options.query query string
 */
const PostsResult: React.FC<{query:string}> = ({query}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = usePosts(query);

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='search-result'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div role='search-results' className='posts-wrapper search-results'>
                    <div className='home-posts'>
                        {data && <Posts view='home' data={data}/>}
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}


/**
 * users search result component
 * @param  {string} options.query query string
 */
const UsersResult: React.FC<{query:string}> = ({query}) => {
    const dispatch = useDispatch();
    let {data, isError, isLoading} = useUsers(query);

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='search-result'>
                { isLoading ? <Spinner type='list' /> : ""}

                <div className='suggestions page' style={{paddingTop:'0'}}>
                    {data && <Users data={data}/>}
                </div>
            </div>

        </React.Fragment>
    );
}



/**
 * Search page
 */
let id;
const Search: React.FC<Router.RouteComponentProps> = ({match, history})=>{
    const params = (match.params as any);
    const [tab, setTab] = useState(0);
    const [query, _setQuery] = useState(params.query);
    const [value, _setValue] = useState(params.query);

    // set input value then wait for some milliseconds
    //  before setting search query, so the browser doesnt lag
    const setQuery = (q)=>{
        clearTimeout(id); // clear previous timeout
        q = q.trim().replace(/(#|@)/g, "");
        params.query = q;
        id = setTimeout(()=>_setQuery(q), 700); // set query in 700ms
    }

    const setValue = (v)=>{
        _setValue(v);
        setQuery(v);
    };

    if (params.query != query) {
        // this can happen if the user uses the header
        // search input, which routes to this component
        setQuery(params.query);
    }

    return (
        <React.Fragment>
            <Header page='explore' hide_icon={true} header_title='Search' />

            <div className='search-page' data-testid='search-page'>
                <div className="suggestions page disp-1 hide-big-screen" style={{paddingTop: '10px'}}>
                    <Suggestions limit={1} />
                    <div className='see-all'>
                        <Link to="/explore/people"> See All </Link>
                    </div>
                </div>

                <div className='search-box'>
                    <form data-testid='search-form' onSubmit={(e)=>{e.preventDefault();setValue(value);}}>
                        <input data-testid='search-input' placeholder="Search" type='search'
                           value={value}
                           className='search-input'
                           onChange={(e)=>setValue(e.target.value)}
                       />
                   </form>
                </div>
                <div className="row flex-spaces tabs">
                    <input id="tab1" type="radio" name="tabs" defaultChecked/>
                    <label data-testid="tab1" onClick={()=>setTab(0)} className='title' htmlFor="tab1">Posts</label>

                    <input id="tab2" type="radio" name="tabs"/>
                    <label data-testid="tab2" onClick={()=>setTab(1)} className='title' htmlFor="tab2">Users</label>

                    <div className="content" id="content1">{tab==0 && <PostsResult query={query} />}</div>
                    <div className="content" id="content2"> {tab==1 && <UsersResult query={query} />} </div>
                </div>
            </div>

        </React.Fragment>
    );
}


/**
 * use users hook
 * @param  {string} query query string
 */
function useUsers(query) {
    const {data, error} = useSWR(`/api/users?q=${query}&limit=90`, fetchListing);
    return {
        data,
        isError: error,
        isLoading: !data && !error,
    }    
}


/**
 * use posts hook
 * @param  {string} query query string
 */
function usePosts(query) {
    const {data, error} = useSWR(`/api/posts?q=${query}&limit=90`, fetchListing);
    return {
        data,
        isError: error,
        isLoading: !data && !error,
    }
}


export default Search;
