import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../__test__/wrap-component';

import Home from '../Home';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <Home />
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


test("properly renders all posts", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('post-wrapper');
    expect((await screen.queryAllByRole('post'))[0]).not.toEqual(undefined);
    expect((await screen.queryAllByRole('carousel-child'))[0]).not.toEqual(undefined);
    expect((await screen.queryAllByRole('video-player'))[0]).not.toEqual(undefined);
    expect((await screen.queryAllByRole('image-viewer'))[0]).not.toEqual(undefined);

    //////////////////////
    // test like button //
    //////////////////////

    const likeBtns = await screen.queryAllByRole('like-post-btn-H');
    fireEvent.click(likeBtns[0]);

    const likes = await screen.queryAllByRole('post-likes-H');
    expect(likes[0]).toHaveTextContent('1 likes');
});


test("can switch post view to compact mode", async ()=>{
    const {getByTestId} = render(component);

    // toggle view
    fireEvent.click(getByTestId('toggler-input-hidden'));

    await screen.queryAllByRole('full-view-card');

    //////////////////////
    // test like button //
    //////////////////////

    const likeBtns = await screen.queryAllByRole('like-post-btn');
    const likes = await screen.queryAllByRole('post-likes');

    expect(likes[0]).toHaveTextContent('0');
    fireEvent.click(likeBtns[0]);
    expect(likes[0]).toHaveTextContent('1');

});


test("test error response", async()=>{
    const {getByTestId} = render(component);
    await screen.findByRole('post-wrapper-err');
});

