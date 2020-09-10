import React from 'react';
import ReactDOM from 'react-dom';
import {render, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../__test__/wrap-component';

import Explore from '../Explore';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <Explore />
    </Wrapper>
);

let c = 0;

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
    rest.get('/api/posts', (req, res, ctx) => {
        c += 1;
        return c <= 1
        ? res(
            ctx.status(200),
            ctx.json(samplePosts)
        )
        : res(
            ctx.status(200),
            ctx.json({errors: ['this is just a sample error']})
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


test("properly renders all posts", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('grid-container');
    await screen.queryAllByRole('grid');
    await screen.queryAllByRole('media-info');
    await screen.queryAllByRole('post-info');
});

