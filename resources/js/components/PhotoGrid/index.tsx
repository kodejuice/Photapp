import React from 'react';
import "./styles.scss";
import {rand_int, random} from '../../helpers/util';

type Media = {
    post_id: number,
    preview_image: string,
    media_type: string,
    multiple: boolean,
};

type Props = {
    data: Media[],
};


// grid configurations
const grid_config = {
    // number_of_photos: grid config that needs that number of photos
    1: ['config9'],
    2: ['config8'],
    3: ['config1', 'config2'],
    4: ['config7'],
    5: ['config3', 'config4', 'config5'],
    6: ['config6'],
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
        let take = rand_int(2, Math.min(posts.length, 6)),
            p: Media[] = [];

         while (take--) if (posts.length) {
            p.push(posts.shift() as Media);
        }
        partitions.push(p);
    }

    return partitions;
}


const Grid: React.FC<{config:string, photos:Media[]}> = ({config, photos})=>{
    return (
        <React.Fragment>
            <div className={`photo_grid ${config}`}>
                {photos.map((photo, i)=>(
                    <figure key={photo.post_id} className={`grid__item${i+1}`}>
                        <img className="grid__img" src={"/test/1.png"} />
                    </figure>
                ))}
            </div>
        </React.Fragment>
    );
};


const Photos: React.FC<Props> = ({data})=>{
    let partitions = partitionPosts(data);

    return (
        <React.Fragment>
            {partitions.map((v,i) => <Grid key={v[0].preview_image} config={random(grid_config[v.length])} photos={v} />)}
        </React.Fragment>
    );
};


export default Photos;
