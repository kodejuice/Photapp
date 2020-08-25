import SWR from 'swr';

/**
 * A wrapper around the `swr` module, 
 *  we store all responses in a hash table so whenever axios
 *  begins to return an error response we return those stored data
 *
 * Normally the swr module would return stale data if the request throws
 *  an error, but i've tampered with axios to not throw any error if the server
 *  returns an invalid response,
 * 
 *  instead it returns an object with a 'errors'
 *  property containing an array of errors generated -> {errors: [...]}
 *
 */

const CACHE = {};


export default function useSWR(arg: string, fetcher) {
    let {data, error} = SWR(arg, fetcher);
    const key = arg + fetcher.name;

    if (error) {
        // return stale data if any
        data = CACHE[key];
    }
    else if (data) {
        // if data.errors[] isnt undefined
        //  then this is an invalid response
        // 
        // @see `helpers/fetcher.ts` -> section /_User Accout Requests_/
        // 
        if (data.errors instanceof Array) {
            if (CACHE[key]) {
                data = CACHE[key];
            }
        } else {
            // else store response in CACHE
            CACHE[key] = data;
        }
    }

    return {
        data,
        error,
    };
}
