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
 *  to a different page/component, otherwise i could have used useMemo
 */
W.__photo_grid_config_cache__ = new Map();
export function memoize<T>(fn: ()=>T, ...deps: any[]) {
    let val, key = JSON.stringify(deps);

    if (W.__photo_grid_config_cache__.has(key)) {
        return W.__photo_grid_config_cache__.get(key);
    }

    W.__photo_grid_config_cache__.set(key, val = fn());

    return val;
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


/**
 * copies text to clipboard
 * @param {string} text [description]
 */
export function copyText(text: string, callback: (copied: boolean)=>void) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        if (document.execCommand('copy')) {
            callback(true);
        }
    } catch (err) {
        callback(false);
    }

    document.body.removeChild(textArea);
}