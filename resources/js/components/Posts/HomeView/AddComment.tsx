import React, {useState} from 'react';

/**
 * component for adding comments to
 *  posts displayed in the home page
 */

const AddComment: React.FC<{post_id: number}> = ({post_id})=>{
    const [commentText, setCommentText] = useState("");

    return (
        <React.Fragment>
            <div className='col col-fill'>
                <input type='text' value={commentText} placeholder='Add a comment...' onChange={_=>setCommentText(_.target.value)}/>
            </div>
            <div className='col col-1'>
                <button onClick={()=>submitComment(post_id, commentText)} className='post' disabled={commentText.trim().length < 1}>
                    Post
                </button>
            </div>
        </React.Fragment>
    );
};


function submitComment(post_id: number, commentText: string) {
    if (!commentText.length) return;
    // TODO: submit comment

    alert(commentText);
}

export default AddComment;
