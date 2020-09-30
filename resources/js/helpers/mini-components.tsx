import React from 'react';
import {useHistory} from 'react-router-dom';
import Toggler from 'react-toggle';
import Cookie from 'js-cookie';

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




/**
 * component used to toggle post view in home page
 */
const compactViewIcon = <svg viewBox="0 0 66 50" fill="#fafafa"><path fill="#fafafa" d="M711,348.280776 L711,350 C711,351.656854 709.656854,353 708,353 L672,353 C670.343146,353 669,351.656854 669,350 L669,348.280776 L660.727607,350.348875 C659.120222,350.750721 657.491419,349.773439 657.089572,348.166054 C657.030082,347.928092 657,347.683733 657,347.438447 L657,318.561553 C657,316.904699 658.343146,315.561553 660,315.561553 C660.245285,315.561553 660.489645,315.591635 660.727607,315.651125 L669,317.719224 L669,316 C669,314.343146 670.343146,313 672,313 L708,313 C709.656854,313 711,314.343146 711,316 L711,317.719224 L719.272393,315.651125 C719.510355,315.591635 719.754715,315.561553 720,315.561553 C721.656854,315.561553 723,316.904699 723,318.561553 L723,347.438447 C723,347.683733 722.969918,347.928092 722.910428,348.166054 C722.508581,349.773439 720.879778,350.750721 719.272393,350.348875 L711,348.280776 Z M681.571429,351 L686.944286,345.3585 L681.031412,339.445625 L671.055272,350.328686 C671.191231,350.719509 671.562859,351 672,351 L681.571429,351 Z M684.333333,351 L708,351 C708.552285,351 709,350.552285 709,350 L709,340.380199 L701.974621,332.476648 L684.333333,351 Z M709,337.369801 L709,316 C709,315.447715 708.552285,315 708,315 L672,315 C671.447715,315 671,315.447715 671,316 L671,347.429198 L680.262846,337.324275 C680.647557,336.904591 681.304529,336.890316 681.707107,337.292893 L688.324007,343.909793 L701.275862,330.310345 C701.679338,329.886695 702.35873,329.898372 702.747409,330.335636 L709,337.369801 Z M660.242536,317.59141 C660.163215,317.57158 660.081762,317.561553 660,317.561553 C659.447715,317.561553 659,318.009268 659,318.561553 L659,347.438447 C659,347.520209 659.010027,347.601662 659.029857,347.680983 C659.163806,348.216778 659.706741,348.542538 660.242536,348.40859 L669,346.219224 L669,319.780776 L660.242536,317.59141 Z M719.757464,348.40859 C720.293259,348.542538 720.836194,348.216778 720.970143,347.680983 C720.989973,347.601662 721,347.520209 721,347.438447 L721,318.561553 C721,318.009268 720.552285,317.561553 720,317.561553 C719.918238,317.561553 719.836785,317.57158 719.757464,317.59141 L711,319.780776 L711,346.219224 L719.757464,348.40859 Z M681,332 C678.238576,332 676,329.761424 676,327 C676,324.238576 678.238576,322 681,322 C683.761424,322 686,324.238576 686,327 C686,329.761424 683.761424,332 681,332 Z M681,330 C682.656854,330 684,328.656854 684,327 C684,325.343146 682.656854,324 681,324 C679.343146,324 678,325.343146 678,327 C678,328.656854 679.343146,330 681,330 Z" transform="translate(-657 -313)"/></svg>;
const listViewIcon = <svg viewBox="0 0 100 125" fill="#fafafa" ><path fill="#fafafa" d="M30,37.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V40C32.5,38.6,31.4,37.5,30,37.5z   M27.5,57.5h-15v-15h15V57.5z"/><path d="M30,7.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V10C32.5,8.6,31.4,7.5,30,7.5z   M27.5,27.5h-15v-15h15V27.5z"/><path d="M30,67.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V70C32.5,68.6,31.4,67.5,30,67.5z   M27.5,87.5h-15v-15h15V87.5z"/><path d="M90,12.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,12.5,90,12.5z"/><path d="M90,42.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,42.5,90,42.5z"/><path d="M90,72.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,72.5,90,72.5z"/><path d="M40,27.5h30c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5H40c-1.4,0-2.5,1.1-2.5,2.5S38.6,27.5,40,27.5z"/><path d="M40,57.5h30c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5H40c-1.4,0-2.5,1.1-2.5,2.5S38.6,57.5,40,57.5z"/><path d="M70,82.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h30c1.4,0,2.5-1.1,2.5-2.5S71.4,82.5,70,82.5z"/></svg>;

type views = 'home' | 'full';
const toggleView:{[index:string]:views} = {
    'full':'home',
    'home':'full',
};

export function Toggle({setState, current}) {
    return (
        <React.Fragment>
            <input hidden onClick={()=>setState(toggleView[current])} data-testid='toggler-input-hidden' />
            <Toggler
                defaultChecked={current=='full'}
                icons={{
                    checked: listViewIcon,
                    unchecked: compactViewIcon,
                }}
                onChange={()=>{
                    Cookie.set('post_view', toggleView[current], { expires: 7 });
                    setState(toggleView[current]);
                }}
            />
        </React.Fragment>
    );
}

