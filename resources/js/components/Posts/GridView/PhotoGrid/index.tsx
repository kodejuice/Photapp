import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import "./styles.scss";
import {rand_int, random, memoize, amount, shuffle} from '../../../../helpers/util';
import {multiplePhotoIcon, VideoIcon, heartIcon_blank_svg as heartIcon, commentIcon} from '../../../../helpers/mini-components';
import {getVideoThumnail, thumbnailFromCache} from '../../../../helpers/window';

type Media = {
    post_id: number,
    post_url: string,
    media_type: 'photo' | 'video',
    multiple: boolean,
    like_count: number,
    comment_count: number,
};

type Props = {
    data: Media[],
};

// grid configurations
const grid_configs = () => ({
    // {number_of_photos}: grid config that needs that number of photos
    1: ['config9'],
    2: ['config8'],
    3: shuffle(['config1', 'config2']),
    4: ['config7'],
    5: shuffle(['config3', 'config4', 'config5']),
    6: ['config6'],
});

let G = {
    config: grid_configs()
};


/**
 * divide posts into partitions of sizes:
 *  1, 2, 3, 4, 5, 6
 *
 * @param  {Media[]}
 * @return {Media[][]}
 */
function partitionPosts(posts: Media[]): Media[][] {
    let partitions: Media[][] = [];

    while (posts.length) {
        let take = rand_int(3, Math.min(posts.length, 6)),
            p: Media[] = [];

         while (take--) if (posts.length) {
            p.push(posts.shift() as Media);
        }
        partitions.push(p);
    }

    return partitions;
}



// a single grid item component
const GridItem: React.FC<{photo: Media, index: number}> = ({photo, index})=>{
    const videoRef = useRef<HTMLVideoElement|null>(null);
    const [previewImage, setPreviewImage] = useState(
        photo.media_type == 'video'
        ? thumbnailFromCache(photo.post_url)
        : photo.post_url
    );

    return (
        <figure className={`grid__item grid__item${index}`}>
            <Link to={`/post/${photo.post_id}`}>
                {(photo.media_type=='video' || photo.multiple) && (
                    <div className='media-info' role='media-info'> {photo.media_type=='video' ? VideoIcon : multiplePhotoIcon} </div>
                )}
                <div className='post-info' role='post-info'>
                    <div className='like_comment'>
                        <div className='row'>
                           <p className='col col-fill'><span>{heartIcon}</span><span>{amount(photo.like_count)}</span></p>
                           <p className='col col-fill hidden'></p>
                           <p className='col col-fill'><span>{commentIcon}</span><span>{amount(photo.comment_count)}</span></p>
                        </div>
                    </div>
                </div>
                {photo.media_type=='video' && previewImage==null && (
                    <video
                        ref={videoRef}
                        src={`/api/dl?url=${photo.post_url}`}
                        onLoadedData={()=>{
                            setPreviewImage(
                                getVideoThumnail(videoRef.current as HTMLVideoElement)
                            )
                        }} />
                )}
                <img className="grid__img" src={`${previewImage}`} />
            </Link>
        </figure>
    );
}


// Grid component
//  displays photos with one of the
//  grid config
const Grid: React.FC<{config:string, photos:Media[]}> = ({config, photos})=>{
    return (
        <React.Fragment>
            <div role='grid' className={`photo_grid ${config}`}>
                {photos.map((photo, i)=>(
                    <GridItem photo={photo} key={photo.post_id} index={i+1}/>
                ))}
            </div>
        </React.Fragment>
    );
};


// for each partition
//  pick a random grid config
//  and display the grid component
const Photos: React.FC<Props> = ({data})=>{

    let partitions = memoize(()=> {
        // this will be called if data changes
        G.config = grid_configs();
        return partitionPosts(data);
    }, data);

    return (
        <React.Fragment>
            {partitions.map((v,i) => <Grid key={v[0].post_id} config={G.config[v.length][0]} photos={v} />)}
        </React.Fragment>
    );
};


export default Photos;
