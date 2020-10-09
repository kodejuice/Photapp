import React, {useState, useRef} from 'react';
import {useDispatch} from 'react-redux';

import {waiting, deleteIcon} from '../../helpers/mini-components';
import {VideoViewer} from '../Posts/HomeView/MediaViewer';
import {openFileDialog, getUploadedFileURL, exceedsSizeLimit, is, beginUpload} from './helper';
import ViewFileModal from './view-file-modal';
import "./style.scss";

type Post = File;

const AddPost: React.FC<{}> = ()=>{
    const dispatch = useDispatch();

    const [posts, setPosts] = useState<Post[]>([]);
    const [postCaption, setPostCaption] = useState("");

    const [selected, setSelected] = useState<Post>();
    const [isLoading, setLoading] = useState(false);

    const removeFile = (file: Post)=>{
        let key = file.name + file.size;
        let new_posts: Post[] = [];
        for (let i=0, k; i < posts.length; ++i) {
            let {name, size} = posts[i];
            k = name + size;
            if (k != key) {
                new_posts.push(posts[i]);
            }
        }
        setPosts(new_posts);
    }


    return (
        <React.Fragment>
            <div id='addpost-modal'>
                <ViewFileModal file={selected} />
                <input className="modal-state" id="modal-addpost" type="checkbox"/>

                <div className="modal">
                    <label className="modal-bg" htmlFor="modal-addpost"></label>
                    <div className="modal-body add-post">

                        <div className='modal-title'> Add Post </div>
                        <div className='added-posts'>
                            <div className='row'>
                                {posts.map((file,i)=>(
                                    <div className='file-box' key={i}>
                                        <div className='action'>
                                            <button className='remove' onClick={()=>removeFile(file)}> {deleteIcon} </button>
                                        </div>
                                        <label onClick={()=>setSelected(file)} htmlFor="modal-viewfile">
                                            {
                                                file.type.includes('video')
                                                ? <VideoFile file={file} />
                                                : <ImageFile file={file} />
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {posts.some(file=>is('video',file.type)) && (
                                <div className='note'>
                                    <p> Uploaded videos will be clipped to the first 45seconds </p>
                                </div>
                            )}

                            <div className='file-box add'>
                                <button disabled={isLoading} title="Add file" onClick={()=>openFileDialog()}>
                                    <img src='/icon/add-bw.png'/>
                                </button>
                            </div>

                            {posts && posts.length>0 && (
                                <div className='submit'>
                                    <div id='btn'>
                                        <button disabled={isLoading} onClick={()=>{
                                            beginUpload(setLoading, setPosts, posts, postCaption, dispatch)
                                        }}> Post </button>
                                    </div>
                                    <input disabled={isLoading} value={postCaption} type="text" onChange={e=>setPostCaption(e.target.value)} placeholder="Enter caption..." />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!isLoading && <input hidden accept='image/*, video/*' name="post" type='file' id='addpost-file-input' onChange={e=>addPost(e, posts, setPosts)} />}
            </div>
        </React.Fragment>
    );
}


/**
 * displays user uploaded video 
 *
 * @param {Post}     props.file
 */
export const VideoFile: React.FC<{file:Post, large?:boolean}> = ({file, large})=>{
    const [videoURL, setVideoURL] = useState("");

    getUploadedFileURL(file)
        .then(url=>setVideoURL(url))
        .catch(()=>{});

    return (
        large
        ? <VideoViewer url={videoURL} />
        : <video src={videoURL} id='video' />
    )
}


/**
 * displays user uploaded photo 
 *
 * @param {Post}     props.file
 */
export const ImageFile: React.FC<{file:Post}> = ({file})=>{
    const [imgURL, setImgURL] = useState(waiting);

    getUploadedFileURL(file)
        .then(url=>setImgURL(url))
        .catch(()=>{});

    return (
        <img id='photo' src={imgURL} alt="Photo" />
    )
}


/**
 * adds selected file to posts state
 * @param {FormEvent<HTMLInputElement>}       event
 * @param {Post[]}                            posts
 * @param {Dispatch<SetStateAction<Post[]>>}  setPosts
 */
function addPost(event: React.FormEvent<HTMLInputElement>, posts: Post[], setPosts: React.Dispatch<React.SetStateAction<Post[]>>) {
    const file: File = ((event.target as HTMLInputElement).files as FileList)[0];
    if (!file?.type) return;
    if (posts.length == 15) {
        return alert("Maximum posts limit reached: 15");
    }
    if (!file?.size || !file?.name) {
        return alert(`Invalid file, Please select another file.\n\nIf this keeps happening then it means you're using an old version of your browser which isnt supported (it doesnt have the balls)`);
    }

    const {type} = file;
    if (!is('video',type) && !is('image',type)) {
        return alert('Only Photos and Videos allowed');
    }

    // enforce file size limit
    let w;
    if (w = exceedsSizeLimit(file)) {
        if (w == 'video') {
            return alert("Video too large, Max size = 30MB");
        } else if (w == 'image') {
            return alert("Image too large, Max size = 10MB");
        }
    }

    setPosts([...posts, file]);
}


export default AddPost;
