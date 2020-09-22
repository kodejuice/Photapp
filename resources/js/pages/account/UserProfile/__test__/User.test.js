import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../../../__test__/wrap-component';

import UserProfile from '../index';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <Switch>
            <UserProfile
                location={{
                    search: ""
                }}
                match={{
                    params: {
                        username: "johndoe"
                    }
                }}
            />
        </Switch>
    </Wrapper>
);


const samplePosts = [
    {
        post_id: 1,
        user_id: 1,
        post_url: '[["file_name1", "file_url1"]]',
        media_type: '["video"]',
        caption: 'a test post by @somebody',
        mentions: '["somebody"]',
        tags: "[]",
        like_count: 0,
        comment_count: 10,
        username: 'johndoe',
    },
    {
        post_id: 2,
        user_id: 1,
        post_url: '[["file_name2", "file_url2"]]',
        media_type: '["image"]',
        caption: 'another test post by @somebody #no2',
        mentions: '["somebody"]',
        tags: '["no2"]',
        like_count: 0,
        comment_count: 10,
        username: 'johndoe',
    },
];


const sampleUsers = [
    {
        username: 'jondoe',
        profile_pic: 'image.png',
        auth_user_follows: 0,
        follows_auth_user: 0,
        full_name: "John Doe",
        follows: 2,
        followers: 2,
        posts_count: 2,
        bio: "i'm used in a test, therefore i am",
    },
    {
        username: 'kodejuice',
        profile_pic: 'kodejuice.png',
        auth_user_follows: 1,
        follows_auth_user: 0,
        full_name: "Sochima Biereagu"
    },
];


/////////////////////
/////////////////////
// Server mockup
let server = setupServer(

    // @johndoe profile
    rest.get('/api/user/getprofile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleUsers[0])
        )
    }),

    // posts/mentions/bookmarks
    rest.get('/api/user/johndoe/posts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts)
        )
    }),
    rest.get('/api/user/johndoe/mentions', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts)
        )
    }),
    rest.get('/api/user/johndoe/bookmarks', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts)
        )
    }),

    // following / followers
    rest.get('/api/user/johndoe/following', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleUsers)
        )
    }),
    rest.get('/api/user/johndoe/followers', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleUsers)
        )
    }),
);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
/////////////////////
/////////////////////


/////////////////////
/////////////////////
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) return
    if (/Warning.*Cannot update a component/.test(args[0])) return
    originalError.call(console, ...args)
  }
})
afterAll(() => {
  console.error = originalError
})
/////////////////////
/////////////////////


test('renders without crashing', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(component, div);
});


test("displays users posts on page render", async ()=>{
    const {getByTestId} = render(component);

    // post results are shown
    await screen.findByRole('user-profile-sm');
    await screen.findByRole('user-profile-bg');

    await screen.findByRole('posts');
    await screen.queryAllByRole('post');
});


test("fetches following/followers on page render", async ()=>{
    const {getByTestId} = render(component);
    await screen.queryAllByRole('user');
});


test("displays mentions on tab switch", async ()=>{
    const {getByTestId} = render(component);

    // switch to mentions tab
    fireEvent.click(getByTestId('tab3'));

    // user mentions are shown
    await screen.findByRole('mentions');
    await screen.queryAllByRole('post');
});
