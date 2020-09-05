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

                <div className='posts-wrapper search-results'>
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
    return <div> users result {query} </div>;
}



/**
 * Search page
 */
const Search: React.FC<Router.RouteComponentProps> = ({match, history})=>{
    const params = (match.params as any);
    const [tab, setTab] = useState(0);
    const [query, _setQuery] = useState(params.query);

    const setQuery = (q)=>{
        q = q.trim().replace(/#/g, "");
        _setQuery(q);
        params.query = q;
    }

    // this can happen if the user uses the header
    // search input, which routes to this component
    if (params.query != query) {
        setQuery(params.query);
    }

    return (
        <React.Fragment>
            <Header page='explore' hide_icon={true} header_title='Search' />

            <div className='search-page'>
                <div className="suggestions page disp-1 hide-big-screen" style={{paddingTop: '10px'}}>
                    <Suggestions limit={1} />
                    <div className='see-all'>
                        <Link to="/explore/people"> See All </Link>
                    </div>
                </div>

                <div className='search-box'>
                    <input placeholder="Search" type='search' value={query} className='search-input' onChange={(e)=>setQuery(e.target.value)} />
                </div>
                <div className="row flex-spaces tabs">
                    <input id="tab1" type="radio" name="tabs" defaultChecked/>
                    <label onClick={()=>setTab(0)} className='title' htmlFor="tab1">Posts</label>

                    <input id="tab2" type="radio" name="tabs"/>
                    <label onClick={()=>setTab(1)} className='title' htmlFor="tab2">Users</label>

                    <div className="content" id="content1">{tab==0 && <PostsResult query={query} />}</div>
                    <div className="content" id="content2"> {tab==1 && <UsersResult query={query} />} </div>
                </div>
            </div>

        </React.Fragment>
    );
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
