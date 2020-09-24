import {Post} from '../components/Posts/props.d';

let W = window as any;

/**
 * limit string
 * @param  {string} str        string
 * @param  {string} lim        limit
 * @return {string}
 */
export function limit(str: string, lim: number): string {
    return str.length > lim ? `${str.substr(0, lim)}...` : str;
}


/**
 * convert figure to human readable amount
 * 123983 -> 123.9k
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
 * memoizer
 *
 * we store the memoized values in a global map
 *  so it doesnt get cleared when react router navigates
 *  to a different page/component, otherwise we could have used useMemo
 */
W.__memoize_cache__ = new Map();
export function memoize<T>(fn: ()=>T, ...deps: any[]) {
    let val, key = JSON.stringify(deps);

    if (W.__memoize_cache__.has(key)) {
        return W.__memoize_cache__.get(key);
    }

    W.__memoize_cache__.set(key, val = fn());

    return val;
}


/**
 * Post memoizer
 *
 * loop over a list of posts and store them in a hash
 *
 * @param {Post[]} posts array of posts to store
 */
W.__memoize_post__ = new Map<number, Post>();
export function posts_store(posts: Post[]) {
    posts.forEach(p => {
        W.__memoize_post__.set(Number(p.post_id), p);
    });
}

/**
 * store single post
 * @param {Post} post
 */
export function post_store(post: Post) {
    W.__memoize_post__.set(post.post_id, post);
}

/**
 * retrieve stored post if any
 * @param {number} post_id  id of post, a key in the map
 */
export function post_get(post_id: number): Post|null {
    post_id = Number(post_id);
    return W.__memoize_post__.has(post_id)
            ? W.__memoize_post__.get(post_id)
            : null;
}



// /**
//  * shuffle array
//  * @param {any[]} array array to shuffle
//  */
// export function shuffle(arr: any[]) {
//     const n = array.length;
//     for (let i=0; i<n; ++i) {
//         let rand_index = ~~(Math.random() * n);
//         [array[i], array[rand_index]] = [array[rand_index], array[i]];
//     }
//     return array;
// }


