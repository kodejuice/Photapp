let W = window as any;

/**
 * gets thumbnail from html video element
 *  as a base64 image
 * @param {HTMLVideoElement} video
 */
W.__photo_grid_thumbnails__ = new Map();
export function getVideoThumnail(video: HTMLVideoElement): string {
    let w = video.videoWidth,
        h = video.videoHeight,
        key = video.src,
        img;

    // save it, so we dont have to do this as long as
    // the user doesnt close the window
    if (W.__photo_grid_thumbnails__.has(key)) {
        return W.__photo_grid_thumbnails__.get(key);
    }

    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(video, 0, 0, w, h);

    img = canvas.toDataURL("image/jpg");

    W.__photo_grid_thumbnails__.set(key, img);

    return img;
}

/**
 * get video thumbnail image from cache
 *  if it exists this is called before we use the canvas trick
 *  to get thumbnail from the video
 * @param {string} key
 */
export function thumbnailFromCache(key: string): string|null {
    return W.__photo_grid_thumbnails__.has(key)
        ? W.__photo_grid_thumbnails__.get(key)
        : null;
}


/**
 * helper function to pause videos
 * that are not visible to the user
 *
 * https://jsbin.com/qekat/1/edit?js
 */
export function watchVideoFocus() {
    const checkScroll = ()=>{
        const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(`.home-posts video`);

        for(let i = 0; i < videos.length; i++) {
            let video = videos[i];
            let x = 0,
            y = 0,
            w = video.offsetWidth,
            h = video.offsetHeight,
            r, //right
            b, //bottom
            visibleX, visibleY, visible,
            parent;

            parent = video;
            while (parent && parent !== document.body) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.offsetParent;
            }

            r = x + w;
            b = y + h;

            visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
            visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

            // a value from 0 to 1
            // 0 -> not visible
            // 1 -> very visible
            visible = visibleX * visibleY / (w * h);

            // this video is barely visible in the current page, pause it
            if (visible <= .40) {
                video.pause();
            }
        }
    }
    window.addEventListener('scroll', checkScroll, false);
    window.addEventListener('resize', checkScroll, false);
    window.addEventListener('load', checkScroll, false);
    checkScroll();
}
