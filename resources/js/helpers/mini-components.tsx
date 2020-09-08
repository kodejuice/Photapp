import React from 'react';
import {useHistory} from 'react-router-dom';

import * as linkify from 'linkifyjs';
import Linkify from 'linkifyjs/react';
import hashtag from 'linkifyjs/plugins/hashtag';
import mention from 'linkifyjs/plugins/mention';

// init Linkify plugins
hashtag(linkify);
mention(linkify);


/**
 * process user input (comment, caption, ...)
 *
 * converts hashtags, mentions, urls,... into clickable JSX elements
 *
 * @param      text          string to process
 * @return     {ReactNode}
 */
export const ProcessUserInput: React.FC<{text: string}> = ({text})=>{
    const history = useHistory();

    const options = {
        formatHref: {
            hashtag(href) {
                return `${location.host}/explore/search/${href.slice(1)}`;
            },
            mention(href) {
                return `${location.host}/user/${href.slice(1)}`;
            },
        },

        attributes: {
            onClick(ev) {
                ev.stopPropagation();
                ev.preventDefault();

                // check if they're not external links
                // if so, use react-router to redirect user
                // else use window.location
                let href = ev.target.href;
                href = href.replace(/^https?:\/\//, '');
                href = href.replace(location.host, '');

                const routes = ['user', 'explore\/search', 'post'];
                const regex = routes.map(r => new RegExp(`^\/?${r}\/(.+)`));

                if (regex.some(R => href.match(R))) {
                    history.push(href);
                } else {
                    window.location = ev.target.href;
                }
            },
        }
    };

    return <Linkify options={options}> {text} </Linkify>;
}
