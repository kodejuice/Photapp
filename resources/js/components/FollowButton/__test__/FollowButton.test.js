import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '.../../../__test__/wrap-component';

import FollowButton from '../index';

window.__JEST_TEST_ENV = true;

let onfollow_callback_works = false;
let onunfollow_callback_works = false;

const component = (
    <Wrapper>
        <FollowButton
            user='johndoe'
            onFollow={()=>{onfollow_callback_works=true;}}
            onUnfollow={()=>{onunfollow_callback_works=true;}}
        />
    </Wrapper>
);

const johndoe = {
    'followers': 0,
};

/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.post('/api/user/johndoe/follow', (req, res, ctx) => {
        johndoe['followers'] += 1;
        return res(
            ctx.status(200),
            ctx.json({message: "User Followed"})
        )
    }),

    rest.post('/api/user/johndoe/unfollow', (req, res, ctx) => {
        johndoe['followers'] -= 1;
        return res(
            ctx.status(200),
            ctx.json({message: "User Unfollowed"})
        )
    }),
);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
/////////////////////
/////////////////////



test('renders without crashing', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(component, div);
});


test("can follow/unfollow users", async ()=>{
    const {getByTestId} = render(component);

    fireEvent.click(getByTestId('follow-btn'));
    let unfollowButton = await screen.findByRole('unfollow-btn');

    expect(johndoe['followers']).toEqual(1);
    expect(onfollow_callback_works).toEqual(true);

    fireEvent.click(unfollowButton);
    await screen.findByRole('follow-btn');

    expect(johndoe['followers']).toEqual(0);
    expect(onunfollow_callback_works).toEqual(true);

});
