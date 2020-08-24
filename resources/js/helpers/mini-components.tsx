import React from 'react';

// TODO: implement this


// make the links like this!
// <a onClick={ev=>{ev.stopPropagation(); history.push(`/user/${d.associated_user}`)}}>


/**
 * return a link to mentioned users in a message (@user -> <Link to='/user/...)
 * @param {string} str string
 */
export function highlightMentions(str: string): React.ReactNode {
    /* wrap in an linline element */
    return <span> {str} </span>;
}
