
/**
 * limit string
 * @param  {string} str        string
 * @param  {string} lim        limit
 * @return {string}
 */
export function limit(str: string, lim: number): string {
    return str.length > lim ? `${str.substr(0, lim)}...` : str;
}

