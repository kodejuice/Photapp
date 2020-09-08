import React from 'react';

import PhotoGrid from '../../PhotoGrid';

const GridPosts: React.FC<{data:any[], view?:'tile'}> = ({data, view})=>{
    view = view || 'tile';

    const posts_data = data.map(({media_type, post_id, post_url, like_count, comment_count}) => ({
        post_id,
        like_count,
        comment_count,
        media_type: JSON.parse(media_type)[0],
        preview_image: JSON.parse(post_url)[0][1],
        multiple: JSON.parse(media_type).length > 1,
    }));

    return <PhotoGrid data={posts_data} />;
}


export default GridPosts;
