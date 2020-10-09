import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import {useDoubleTap} from 'use-double-tap';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {waiting} from '../../../helpers/mini-components';

import {watchVideoFocus} from '../../../helpers/window';
watchVideoFocus();

type ViewerProp = {
    paths: [string, string][], // [[file_name, file_path], ...]
    media_types: 'image'|'video'[],
};

const prevIcon = <svg x="0px" y="0px" viewBox="0 0 490.667 490.667"><path style={{"fill": '#009688'}} d="M245.333,0C109.839,0,0,109.839,0,245.333s109.839,245.333,245.333,245.333s245.333-109.839,245.333-245.333C490.514,109.903,380.764,0.153,245.333,0z"/><path style={{'fill': "#FAFAFA"}} d="M373.333,192H249.749l19.2-19.2c18.893-18.881,18.902-49.503,0.021-68.395c-0.007-0.007-0.014-0.014-0.021-0.021c-19.179-18.247-49.317-18.181-68.416,0.149L82.219,222.699c-12.492,12.496-12.492,32.752,0,45.248l118.315,118.187c17.565,20.137,48.13,22.222,68.267,4.656c20.137-17.565,22.222-48.13,4.656-68.267c-1.445-1.656-3-3.212-4.656-4.656l-19.2-19.2h123.733c29.455,0,53.333-23.878,53.333-53.333S402.789,192,373.333,192z"/></svg>;
const nextIcon = <svg x="0px" y="0px" viewBox="0 0 490.667 490.667"><path style={{"fill": '#009688'}} d="M245.333,0C109.839,0,0,109.839,0,245.333s109.839,245.333,245.333,245.333 s245.333-109.839,245.333-245.333C490.514,109.903,380.764,0.153,245.333,0z"/> <path style={{'fill': "#FAFAFA"}} d="M290.133,104.533c-19.139-18.289-49.277-18.289-68.416,0c-18.893,18.881-18.902,49.503-0.021,68.395c0.007,0.007,0.014,0.014,0.021,0.021l19.2,19.2H117.333C87.878,192.149,64,216.027,64,245.483c0,29.455,23.878,53.333,53.333,53.333h123.584l-19.2,19.2c-17.522,20.175-15.371,50.734,4.804,68.257c18.259,15.858,45.423,15.799,63.612-0.139l118.251-118.251c12.492-12.496,12.492-32.752,0-45.248L290.133,104.533z"/></svg>;
const playIcon = <svg viewBox="0 0 64 64" width="64px" height="64px"><path fill="#f283a5" d="M32 4A28 28 0 1 0 32 60A28 28 0 1 0 32 4Z"/><path fill="#e0678f" d="M32 9A23 23 0 1 0 32 55A23 23 0 1 0 32 9Z"/><path fill="#fff" d="M24,44l22-12L24,20V44z"/><path fill="#8d6c9f" d="M24,45c-0.177,0-0.354-0.047-0.511-0.14C23.187,44.68,23,44.353,23,44V20 c0-0.353,0.187-0.68,0.489-0.86c0.304-0.18,0.679-0.187,0.989-0.018l22,12C46.8,31.297,47,31.634,47,32 c0,0.366-0.2,0.703-0.521,0.878l-22,12C24.329,44.959,24.165,45,24,45z M25,21.685v20.631L43.912,32L25,21.685z"/><path fill="#8d6c9f" d="M52.42,11.407C46.949,5.982,39.704,3,32.005,3c-0.042,0-0.085,0-0.127,0 c-7.746,0.033-15.017,3.08-20.471,8.581S2.967,24.377,3,32.123s3.08,15.016,8.58,20.47C17.051,58.018,24.296,61,31.995,61 c0.042,0,0.085,0,0.127,0c7.746-0.033,15.017-3.08,20.471-8.581S61.033,39.623,61,31.877S57.92,16.861,52.42,11.407z M51.173,51.011 C46.095,56.132,39.326,58.969,32.114,59c-0.04,0-0.079,0-0.119,0c-7.167,0-13.913-2.777-19.006-7.827 C7.867,46.095,5.03,39.326,5,32.114s2.749-14.004,7.827-19.125S24.674,5.031,31.886,5c0.04,0,0.079,0,0.119,0 c7.167,0,13.913,2.777,19.006,7.827C56.133,17.905,58.97,24.674,59,31.886S56.251,45.89,51.173,51.011z"/><path fill="#8d6c9f" d="M32.089 52c-.001 0-.003 0-.005 0-.552.002-.997.452-.995 1.004l.009 2c.002.551.449.996 1 .996.001 0 .003 0 .004 0 .553-.002.998-.452.996-1.004l-.009-2C33.087 52.445 32.64 52 32.089 52zM38.098 52.051c-.146-.534-.699-.844-1.228-.702-.533.146-.848.695-.702 1.228l.526 1.93c.121.445.524.737.964.737.088 0 .176-.012.264-.036.533-.146.848-.695.702-1.228L38.098 52.051zM22.824 49.561c-.479-.274-1.09-.107-1.364.372l-.993 1.736c-.274.479-.107 1.09.372 1.365.156.089.327.132.495.132.347 0 .685-.181.869-.503l.993-1.736C23.471 50.446 23.304 49.835 22.824 49.561zM42.692 49.843c-.279-.478-.888-.64-1.368-.36-.477.278-.638.89-.36 1.367l1.007 1.728c.187.319.521.497.865.497.171 0 .344-.044.503-.136.477-.278.638-.89.36-1.367L42.692 49.843zM27.294 51.39c-.527-.137-1.081.177-1.222.712l-.51 1.934c-.141.534.178 1.081.712 1.222.085.022.171.034.256.034.442 0 .848-.297.966-.746l.51-1.934C28.146 52.078 27.828 51.531 27.294 51.39zM39.264 11.292c.712.262 1.42.568 2.104.91.143.072.295.105.445.105.367 0 .721-.203.896-.553.247-.494.046-1.095-.448-1.341-.748-.374-1.523-.709-2.305-.998-.518-.19-1.093.074-1.284.593C38.48 10.525 38.745 11.1 39.264 11.292zM21.019 12.929c.169 0 .341-.043.498-.134 4.125-2.377 9.001-3.279 13.729-2.543.555.082 1.058-.289 1.143-.834S36.1 8.361 35.555 8.276C30.374 7.469 25.037 8.46 20.52 11.064c-.479.276-.644.887-.367 1.366C20.336 12.75 20.673 12.929 21.019 12.929z"/></svg>;


/**
 * pause other videos if more than 1 video
 * is playing
 */
const pauseOtherVideos = ()=>{
    // make sure only one video is playing
    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(`.card video`),
        playing: HTMLVideoElement[] = [];
    for (let i=0; i<videos.length; ++i) {
        const vid = videos[i];
        if (vid.autoplay) playing.push(vid);
    }
    if (playing.length > 1) {
        playing.slice(1).forEach(v => v.pause());
    }
}


/**
 * pause video in a carousel slide
 *
 * will be called when
 *  - we move to another slide by arrow button
 *  -                             or swiping
 * @param  {string} id  id of video parent element
 */
function pauseCarouselVideo(id) {
    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(`div#${id} video`);
    for (let i=0; i<videos.length; ++i) {
        videos[i].pause();
    }
}



/**
 * Image viewer component
 * @param  {string} url [description]
 */
const PhotoViewer: React.FC<{url:string}> = ({url})=>{
    const [img_url, setUrl] = useState(waiting);

    return (
        <React.Fragment>
            <div role="image-viewer">
                <div style={{display:'none'}}><img src={url} onLoad={()=>setUrl(url)}/></div>
                <img role="post-image" src={img_url} />
            </div>
        </React.Fragment>
    );
}


/**
 * Video player component
 * @param  {string} url [description]
 */
export const VideoViewer: React.FC<{url:string}> = ({url})=>{
    const [playerLoaded, showPlayer] = useState(false);
    const [isPlaying, setPlaying] = useState(false);

    const config = {
        url,
        pip: false,
        width: '100%',
        playsinline: true,
        playing: isPlaying,
        height: playerLoaded ? '100%' : '0',
        onReady() {
            showPlayer(true);
        },
        onPause() {
            setPlaying(false);
        },
        onPlay() {
            pauseOtherVideos();
            setPlaying(true);
        },
    };

    const onclick = useDoubleTap(()=>{}, 300, {
        onSingleTap() {
            setPlaying(!isPlaying);
        }
    });

    return (
        <React.Fragment>
            {!playerLoaded && <img src={waiting} />}
            {!isPlaying && <button className={`play-icon display-${playerLoaded}`} onClick={()=>setPlaying(!isPlaying)}> {playIcon} </button>}

            <div role="video-player" style={{height: '100%'}} {...onclick}>
                <ReactPlayer {...config} />
            </div>

        </React.Fragment>
    );
}


/**
 * Render a carousel containing photos and videos
 * @param  {[string,string][]} paths       urls paths
 * @param  {'image'|'video'[]} media_types media types of each url
 */
const MediaViewer: React.FC<ViewerProp> = ({paths, media_types})=>{
    const id = `vid_parr-${JSON.stringify(paths).split('').map(c => c.charCodeAt(0)>>6).reduce((i,a)=>i+a)}`; // simple hashing :/
    const arrowStyles: React.CSSProperties = {
        zIndex: 2,
        width: 30,
        height: 30,
        padding: 0,
        border: 'none',
        position: 'absolute',
        top: 'calc(50% - 15px)',
        cursor: 'pointer',
        boxShadow: 'none',
    };

    const onArrowClick = (click)=>{
        pauseCarouselVideo(id);
        click();
    };

    const config = {
        showThumbs: false,
        showStatus: false,
        dynamicHeight: false,
        useKeyboardArrows: false,
        renderArrowPrev(onClick, hasPrev, label) {
            return hasPrev && <button style={{...arrowStyles, left: 15}} onClick={()=>onArrowClick(onClick)}> {prevIcon} </button>;
        },
        renderArrowNext(onClick, hasNext, label) {
            return hasNext && <button style={{...arrowStyles, right: 15}} onClick={()=>onArrowClick(onClick)}> {nextIcon} </button>
        },
        onSwipeEnd: (event: React.TouchEvent)=>{
            pauseCarouselVideo(id);
        }
    };

    const View = {
        image: (path) => <PhotoViewer url={path} />,
        video: (path) => <VideoViewer url={path} />,
    };

    return (
        <Carousel {...config}>
            {paths.map(([file_name, file_path], i)=>(
                <div key={file_path} style={{height:'100%'}} id={id} role="carousel-child">
                    {View[media_types[i]](file_path)}
                </div>
            ))}
        </Carousel>
    )
}

export default MediaViewer;
