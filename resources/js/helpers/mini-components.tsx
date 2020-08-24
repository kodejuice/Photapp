import React from 'react';

// TODO: implement this

/**
 * return a link to mentioned users in a message (@user -> <Link to='/user/...)
 * @param {string} str string
 */
export function highlightMentions(str: string): React.ReactNode {
    /* wrap in an linline element */
    return <span> {str} </span>;
}
