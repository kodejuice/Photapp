import {Post} from '../components/Posts/props.d';

let W = window as any;

/**
 * limit string
 * @param  {string} str        string
 * @param  {string} lim        limit
 * @return {string}
 */
export function limit(str: string, lim: number): string {
    if (!str) return "";
    return str.length > lim ? `${str.substr(0, lim)}...` : str;
}


/**
 * make figure succinct
 * 123983 -> 123.9k
 * 
 * @param  {number} figure
 * @return {string}
 */
export function amount(figure: number): string {
    const _1m = Number(1e6),
          _100k = Number(1e5),
          _10k = Number(1e4),
          _1k = Number(1e3);

    const fixed = (n: number) => n.toFixed(1);

    if (figure >= _1m){
        return `${fixed(figure/_1m)}m`;
    }
    else if (figure >= _100k) {
        return `${fixed(figure/_1k)}k`;
    }
    else if (figure >= _10k) {
        return `${fixed(figure/_1k)}k`;
    }
    else if (figure >= _1k) {
        return `${fixed(figure/_1k)}k`;
    }
    else {
        return `${figure}`;
    }
}

/**
 * convert string to camel case
 * 'user' -> 'User'
 * @param {string}
 */
export const camel = (x: string) => x[0].toUpperCase() + x.slice(1);


/**
 * return random number from -> to
 * @param {number}   from
 * @param {number}   to
 */
export const rand_int = (from:number, to:number): number => from + ~~(Math.random() * (to-from+1));


/**
 * Return random array element
 */
export const random = (Arr: any[]): any => Arr[rand_int(0, Arr.length-1)];


/**
 * shuffle an array of items (in-place)
 *
 * @param      {array>}  items   The items to shuffle
 */
export function shuffle(items) {
    let j, x, i;
    for (i = items.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = items[i - 1];
        items[i - 1] = items[j];
        items[j] = x;
    }
    return items;
};


/**
 * memoizer
 *
 * we store the memoized values in a global map
 *  so it doesnt get cleared when react router navigates
 *  to a different page/component, otherwise we could have used useMemo
 */
export function memoize<T>(fn: ()=>T, ...deps: any[]) {
    const memoize_cache = W.Store['memoizer'];
    
    let val, key = JSON.stringify(deps);

    if (memoize_cache.has(key)) {
        return memoize_cache.get(key);
    }

    memoize_cache.set(key, val = fn());

    return val;
}


/**
 * Post memoizer
 *
 * loop over a list of posts and store them in a hash
 *
 * @param {Post[]} posts array of posts to store
 */
export function posts_store(posts: Post[]) {
    const posts_map = W.Store['posts'];

    posts.forEach(p => {
        if (!p.post_id) return;
        posts_map.set(Number(p.post_id), p);
    });
}

/**
 * store single post
 * @param {Post} post
 */
export function post_store(post: Post) {
    const posts_map = W.Store['posts'];

    posts_map.set(post.post_id, post);
}

/**
 * retrieve stored post if any
 * @param {number} post_id  id of post, a key in the map
 */
export function post_get(post_id: number): Post|null {
    const posts_map = W.Store['posts'];
    post_id = Number(post_id);

    return posts_map.has(post_id)
        ? posts_map.get(post_id)
        : null;
}


/**
 * merge two array of objects together
 *  discarding duplicates
 * @param  {string}    uid              unique prop of each object (used to discard duplicates)
 * @param  {Post[]} all_data         original array
 * @param  {Post[]} new_data         array to merge with
 */
export function merge_objects(uid: string, all_data: any[], new_data: any[]) {
    if (!new_data) return;
    if (new_data[0] && !(uid in new_data[0])) return;
    const ids = new Set(all_data.map(o => o[uid]));

    for (let p of new_data) {
        if (!ids.has(p[uid])) {
            all_data.push(p);
        }
    }
}
