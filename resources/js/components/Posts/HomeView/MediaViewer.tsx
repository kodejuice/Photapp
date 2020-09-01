import React from 'react';
import ReactPlayer from 'react-player';
import {watchVideoFocus} from '../../../helpers/window';

watchVideoFocus();

type ViewerProp = {
    paths: [string, string][], // [[file_name, file_path], ...]
    mentions: string[] | null,
};


const MediaViewer: React.FC<ViewerProp> = ({paths, mentions})=>{

    let url = '/test/2.mp4';

    // console.log(ReactPlayer.canPlay(url));

    const options = {
        // playing: true,
        width: '100%',
        height: 'auto',
        controls: true,
        // playsinline: true,
    }

    return <img src='/test/1.png'/>;
    // return <ReactPlayer url={url} {...options} />;
}

export default MediaViewer;
