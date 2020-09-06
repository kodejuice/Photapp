import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../__test__/wrap-component';

import Search from '../Search';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <Switch>
        <Search
            match={{
                params: {
                    query: "johndoe"
                }
            }}
        />
        </Switch>
    </Wrapper>
);

const sampleUsers = [
    {
        username: 'jondoe',
        profile_pic: 'image.png',
        auth_user_follows: 0,
        follows_auth_user: 0,
        full_name: "John Doe"
    },
    {
        username: 'kodejuice',
        profile_pic: 'kodejuice.png',
        auth_user_follows: 1,
        follows_auth_user: 0,
        full_name: "Sochima Biereagu"
    },
];

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


/////////////////////
/////////////////////
// Server mockup
let server = setupServer(
    // GET
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleUsers)
        )
    }),

    rest.get('/api/posts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts)
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


test("displays posts search result", async ()=>{
    const {getByTestId} = render(component);

    // fill the search input
    fireEvent.change(getByTestId('search-input'), {
        target: {value: 'johnd'},
    });
    fireEvent.submit(getByTestId('search-form'));

    // post results are shown
    await screen.findByRole('search-results');
    await screen.queryAllByRole('post');
    await screen.queryAllByRole('carousel-child');
    await screen.queryAllByRole('video-player');
    await screen.queryAllByRole('image-viewer');
});


test("displays users search results", async ()=>{
    const {getByTestId} = render(component);

    // fill the search input
    fireEvent.change(getByTestId('search-input'), {
        target: {value: 'john'},
    });
    fireEvent.submit(getByTestId('search-form'));

    // switch tab to users
    fireEvent.click(getByTestId('tab2'));

    // user results are shown
    await screen.queryAllByRole('user');
});


