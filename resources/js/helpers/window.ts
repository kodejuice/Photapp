
/**
 * helper function to pause videos
 * that are not visible to the user
 *
 * https://jsbin.com/qekat/1/edit?js
 */
export function watchVideoFocus() {
    const checkScroll = ()=>{
        const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll(`.home-posts .card video`);

        for(var i = 0; i < videos.length; i++) {
            var video = videos[i];
            var x = 0,
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

            // this video is barely visible in the current page pause it
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
