import React from 'react';
import {PostProp} from './props.d';

import HomeView from './HomeView';
// import {GridView} from './GridView';
// import {TileView} from './TileView';

const views = {
    // 'tile': (data) => <TileView data={data} />,
    // 'grid': (data) => <GridView data={data} />,
    'home': (data) => <HomeView data={data} />,
}

const Posts: React.FC<PostProp> = ({data, view})=>{
    return views[view](data);
}

export default Posts;
