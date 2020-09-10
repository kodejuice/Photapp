import React from 'react';

import PhotoGrid from '../../PhotoGrid';

const GridPosts: React.FC<{data:any[], view?:'tile'}> = ({data, view})=>{
    view = view || 'tile';

    const posts_data = data.map(({media_type, post_id, post_url, like_count, comment_count}) => {
        let media_types = JSON.parse(media_type);

        post_url = JSON.parse(post_url)[0][1];
        media_type = media_types[0];

        return {
            post_id,
            like_count,
            comment_count,
            media_type,
            post_url,
            multiple: media_types.length > 1,
        };
    });

    return <PhotoGrid data={posts_data} />;
}


export default GridPosts;
