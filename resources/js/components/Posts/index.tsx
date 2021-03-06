import React from 'react';
import {PostProp} from './props.d';

import HomeView from './HomeView';
import GridView from './GridView';
import TileView from './TileView';
import FullView from './FullView';

const views = {
    'grid': (data) => <GridView data={data} />,
    'tile': (data) => <TileView data={data} />,
    'home': (data) => <HomeView data={data} />,
    'full': (data) => <FullView data={data} />,
}

const Posts: React.FC<PostProp> = ({data, view})=>{
    return views[view](data);
}

export default Posts;
