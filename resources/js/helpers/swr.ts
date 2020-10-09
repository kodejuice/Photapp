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

export const W = window as any;

const SWR_MAP = W.Store['swr_map'];

export default function useSWR(arg: string, fetcher) {
    let response = SWR(arg, fetcher);
    const key = arg + fetcher.name;
    let {data, error}  = response;

    // we dont need CACHE in tests
    if ((window as any).__JEST_TEST_ENV) {
        return response;
    }

    // store data in map
    if (data) {
        if (data instanceof Array) {
            if (data.length) {
                SWR_MAP.set(key, data);
            }
        } else if (!data.errors) {
            SWR_MAP.set(key, data);
        }
    }


    if (error) {
        // return stale data if any
        data = SWR_MAP.get(key);
    }
    else if (data) {
        // if data.errors[] isnt undefined
        //  then this is an invalid response
        // 
        // @see `helpers/fetcher.ts` -> section /_User Accout Requests_/
        // 
        if (data.errors instanceof Array) {
            if (SWR_MAP.has(key)) {
                data = SWR_MAP.get(key);
            }
        }
    } else {
        //  no data available, return __SWR_MAP__ data if available
        if (SWR_MAP.has(key)) {
            data = SWR_MAP.get(key);
        }
    }

    return {
        ...response,
        data,
    }
}
