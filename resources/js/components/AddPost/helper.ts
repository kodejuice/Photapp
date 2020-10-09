import {uploadUserPost} from '../../helpers/fetcher';
import showAlert from '../Alert/showAlert';

const W = window as any;

type Post = File;

/**
 * Opens a file dialog.
 */
export function openFileDialog() {
    const inputElement = (document.querySelector('#addpost-modal input#addpost-file-input') as HTMLInputElement);

    inputElement?.click();
}


/**
 * Begins an upload.
 *
 * @param      {Dispatch<SetStateAction<boolean>>}  setLoading
 * @param      {Dispatch<SetStateAction<Post>>}     setPosts
 * @param      {Post}                               posts       The posts
 * @param      {string}                             caption     The caption
 */
export function beginUpload(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    posts: Post[],
    caption: string,
    dispatch
) {
    setLoading(true);

    uploadUserPost(posts, caption)
        .then(res => {
            if (res?.errors instanceof Array) {
                showAlert(dispatch, res.errors);
            }
            else if (res?.success) {
                showAlert(dispatch, ["Files uploaded, processing..."], 'success');
                setPosts([]);
            }
        })
        .catch(e=>{})
        .finally(()=>{
            setLoading(false);
        });
}


/**
 * Gets the uploaded file url as a base64 string.
 *
 * @param      {Post}  file    The file
 */
W.__uploaded_file_url_map__ = new Map<string, string>();
export async function getUploadedFileURL(file: Post): Promise<string> {
    const reader = new FileReader();
    const map = W.__uploaded_file_url_map__;
    const key = `${file.name}:${file.type}:${file.size}`;

    return new Promise((resolve)=>{
        if (map.has(key)) {
            return resolve(map.get(key));
        }

        reader.addEventListener('load', (event) => {
            const url = event?.target?.result as string;
            map.set(key, url);
            resolve(url);
        });

        reader.readAsDataURL(file);
    });
}


/**
 * does the uploaded file exceed the max limit,
 * if yes which, 'video' or 'image'
 *
 * @param  {Post}     file         Post
 * @return {'video'|'image'|null}
 */
export function exceedsSizeLimit(file: Post): 'image'|'video'|null {
    const _30mb = 30 * 1024 * 1024,
          _10mb = 10 * 1024 * 1024;

    if (is('video',file.type) && file.size > _30mb) {
        return 'video';
    } else if (is('image',file.type) && file.size > _10mb) {
        return 'image';
    }

    return null;
}


/**
 * determine file type
 *
 * @param      {string}  expectation  The expectation
 * @param      {string}  type         The type (file.type)
 */
export function is(expectation: string, type: string) {
    return type.includes(expectation);
}
