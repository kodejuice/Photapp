import React from 'react';
import {PostProp} from './props.d';

import HomeView from './HomeView';
import GridView from './GridView';

const views = {
    'grid': (data) => <GridView data={data} />,
    'tile': (data) => <GridView data={data} view='tile' />,
    'home': (data) => <HomeView data={data} />,
}

const Posts: React.FC<PostProp> = ({data, view})=>{
    return views[view](data);
}

export default Posts;
