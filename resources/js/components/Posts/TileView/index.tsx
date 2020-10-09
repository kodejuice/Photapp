import React, {useRef, useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {format} from 'date-fns';
import {Post} from '../props.d';
import {amount} from '../../../helpers/util';
import {getVideoThumnail, thumbnailFromCache} from '../../../helpers/window';
import {ProcessUserInput, heartIcon_blank_svg as heartIcon, multiplePhotoIcon, VideoIcon, commentIcon} from '../../../helpers/mini-components';

import "./styles.scss";

type Posts = {
    data: Post[],
}


const blankImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaIAAAGPCAYAAAAeOdSHAAAFxUlEQVR4nO3VMQEAIAzAMMC/10kAGT1IFPTrnpm7ACBy6gAA/mZEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRAyogASBkRACkjAiBlRACkjAiAlBEBkDIiAFJGBEDKiABIGREAKSMCIGVEAKSMCICUEQGQMiIAUkYEQMqIAEgZEQApIwIgZUQApIwIgJQRAZAyIgBSRgRA6gHg5Qbqq7RZ9wAAAABJRU5ErkJggg==";

const TileItem: React.FC<{post:Post}> = ({post})=>{
    const history = useHistory();
    const media_types = JSON.parse(post.media_type);
    const multiple = media_types.length > 1;
    const post_url = JSON.parse(post.post_url)[0][1];
    const media_type = media_types[0];

    const videoRef = useRef<HTMLVideoElement|null>(null);
    const [previewImage, setPreviewImage] = useState(
        media_type == 'video'
        ? thumbnailFromCache(post_url)
        : post_url
    );

    const day = format(new Date(post.created_at || 0), "MMMM d, yyy");
    const caption = post.caption || (post.username ? `Photo by @${post.username} on ${day}.` : '');

    // show img alt text if post image fails to load
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        const img = (ev.target as HTMLImageElement);
        if (img.alt == '.') {
            img.alt = caption;
            img.src = blankImage;
        }
    };


    return (
        <React.Fragment>
            <div className='post-wrap'>
                <div onClick={()=>{history.push(`/post/${post.post_id}`); window.scrollTo(0,0)}} className='link'>
                    {(media_type=='video' || multiple) && (
                        <div className='media-info' role='media-info'> {media_type=='video' ? VideoIcon : multiplePhotoIcon} </div>
                    )}
                    <div className='__post' role='post'>
                        <div className='post-info' role='post-info'>
                            <div className='like_comment'>
                                <div className='row'>
                                   <p className='col col-fill'><span>{heartIcon}</span><span>{amount(post.like_count)}</span></p>
                                   <p className='col col-fill hidden'></p>
                                   <p className='col col-fill'><span>{commentIcon}</span><span>{amount(post.comment_count)}</span></p>
                                </div>
                                <div className='img-caption'> <ProcessUserInput text={caption} /></div>
                            </div>
                        </div>
                        {media_type=='video' && previewImage==null && <video
                            ref={videoRef}
                            src={`/api/dl?url=${post_url}`}
                            onLoadedData={()=>{
                                setPreviewImage(
                                    getVideoThumnail(videoRef.current as HTMLVideoElement)
                                )
                            }}
                        />}
                        <img alt='.' className="post-img" src={`${previewImage}`} onError={onError} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


const TileRow: React.FC<{posts:any[]}> = ({posts})=>{
    const R = React.useRef<number>(Math.floor(Math.random() * 1e10));
    return (
        <React.Fragment>
            <div className='row'>
                {posts.map((post, i)=>(
                    <div key={post?.post_id || (R.current * i)} role='post-col' className='col col-fill post-col'>
                        {post && <TileItem post={post} />}
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};


const TileView: React.FC<Posts> = ({data})=>{
    const parts: Posts[][] = [];
    const first = (arr) => arr.shift()||null;

    while (data.length) {
        parts.push([first(data), first(data), first(data)]);
    }

    return (
        <React.Fragment>
            <div className='tile-view'>
                {parts.map((p,i)=>(
                    <TileRow posts={p} key={i} />
                ))}
            </div>
        </React.Fragment>
    );
}

export default TileView;
