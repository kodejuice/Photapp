import React, {useState, useRef} from 'react';
import {useDispatch} from 'react-redux';

import {waiting} from '../../helpers/mini-components';
import {VideoViewer} from '../Posts/HomeView/MediaViewer';
import {openFileDialog, getUploadedFileURL, exceedsSizeLimit, is, beginUpload} from './helper';
import ViewFileModal from './view-file-modal';
import "./style.scss";

type Post = File;

const deleteIcon = <svg viewBox="0 0 64 64" width="15" height="15"><path fill="#e0678f" d="M32 3A29 29 0 1 0 32 61A29 29 0 1 0 32 3Z"/><path fill="#ed7899" d="M32 8A24 24 0 1 0 32 56A24 24 0 1 0 32 8Z"/><path fill="#fff" d="M42.849,16.908L32,27.757L21.151,16.908c-0.391-0.391-1.024-0.391-1.414,0l-2.828,2.828 c-0.391,0.391-0.391,1.024,0,1.414L27.757,32L16.908,42.849c-0.391,0.391-0.391,1.024,0,1.414l2.828,2.828 c0.391,0.391,1.024,0.391,1.414,0L32,36.243l10.849,10.849c0.391,0.391,1.024,0.391,1.414,0l2.828-2.828 c0.391-0.391,0.391-1.024,0-1.414L36.243,32l10.849-10.849c0.391-0.391,0.391-1.024,0-1.414l-2.828-2.828 C43.873,16.518,43.24,16.518,42.849,16.908z"/><path fill="#faefde" d="M47.713 43.471L36.243 32 32 27.757 20.529 16.287 16.287 20.529 27.757 32 16.287 43.471 20.529 47.713 32 36.243 43.471 47.713z"/><path fill="#fff7f0" d="M47.506,20.737L43.3,16.457l-11.18,11.42L21.237,16.994c-1.172,1.172-1.172,3.071,0,4.243 l21.527,21.527c1.172,1.172,3.071,1.172,4.243,0L36.123,31.88L47.506,20.737z"/><path fill="#8d6c9f" d="M32,2C15.458,2,2,15.458,2,32s13.458,30,30,30s30-13.458,30-30S48.542,2,32,2z M32,60 C16.561,60,4,47.439,4,32S16.561,4,32,4s28,12.561,28,28S47.439,60,32,60z"/><path fill="#8d6c9f" d="M37.657,32l10.142-10.142c0.78-0.78,0.78-2.049,0-2.829l-2.828-2.828 c-0.78-0.781-2.05-0.781-2.829,0L32,26.343L21.858,16.201c-0.778-0.78-2.048-0.78-2.829,0l-2.828,2.828 c-0.78,0.78-0.78,2.049,0,2.829L26.343,32L16.201,42.142c-0.78,0.78-0.78,2.049,0,2.829l2.828,2.828 c0.779,0.78,2.049,0.779,2.829,0L32,37.657l10.142,10.142c0.39,0.39,0.902,0.585,1.415,0.585c0.512,0,1.024-0.195,1.414-0.585 l2.828-2.828c0.78-0.78,0.78-2.049,0-2.829L37.657,32z M43.556,46.385L32,34.829L20.443,46.385l-2.828-2.829L29.171,32 L17.615,20.443l2.829-2.828L32,29.171l11.556-11.556l2.829,2.829L34.829,32l11.556,11.557L43.556,46.385z"/><path fill="#8d6c9f" d="M41.899 30.586c-.391.391-.391 1.024 0 1.414l1.415 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.024 0-1.414l-1.415-1.414C42.923 30.195 42.289 30.195 41.899 30.586zM46.849 27.05c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.414 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L46.849 27.05zM51.799 24.929l-1.414-1.415c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293C52.189 25.953 52.189 25.32 51.799 24.929zM13.615 37.657c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293c.391-.39.391-1.023 0-1.414L13.615 37.657zM17.151 36.95c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414l-1.414-1.414c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414L17.151 36.95zM21.394 33.707c.256 0 .512-.098.707-.293.391-.391.391-1.024 0-1.414l-1.415-1.414c-.391-.391-1.024-.391-1.414 0-.391.391-.391 1.024 0 1.414l1.415 1.414C20.882 33.609 21.138 33.707 21.394 33.707z"/></svg>;

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
