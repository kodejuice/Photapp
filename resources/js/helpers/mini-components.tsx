import React from 'react';
import {useHistory} from 'react-router-dom';

// TODO: implement highlightTagsAndMentions

/**
 * return links to mentioned users in a string
 * 
 * e.g, "hi @mike" -> hi <a href='/user/mike'>mike</a>
 *
 * converts the string to JSXElements, so they actually appear as links
 * when rendered
 *
 * @param {string} str string
 */
export function highlightMentions(str: string): React.ReactNode {
    const history = useHistory();
    let strs = str.split('@');
    let res: {type:string,str:string}[] = [];

    if (strs[0] != '') {
        res.push({
            type: 'text',
            str: strs[0],
        });
    }

    strs.shift();
    let firstWord: string, s: string;
    for (let i=0; i<strs.length; ++i) {
        s = strs[i];

        let match = s.match(/^(\w+)/);
        if (match) {
            // first word
            res.push({
                type: 'link',
                str: match[0]
            });

            // ...rest
            res.push({
                type: 'text',
                str: s.slice(match[0].length)
            });
        } else {
            res.push({
                type: 'text',
                str: "@" + s
            });
        }
    }

    return res.map((o,i)=>{
        if (o.type == 'text') {
            return <span key={o.str}> {o.str} </span>;
        } else {
            return (
                <a key={o.str} onClick={ev=>{ev.stopPropagation(); history.push(`/user/${o.str}`)}}>
                    @{o.str}
                </a>
            );
        }
    });
}
