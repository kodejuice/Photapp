import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../../__test__/wrap-component';

import Post from '../index';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <Post
            match={{
                params: {
                    id: "1"
                }
            }}
        />
    </Wrapper>
);

const samplePosts = [
    {
        post_id: 1,
        user_id: 1,
        post_url: '[["file_name1", "file_url1"]]',
        media_type: '["video"]',
        caption: 'hello world',
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

    {
        post_id: 3,
        user_id: 1,
        post_url: '[["file_name3", "file_url3"]]',
        media_type: '["video"]',
        caption: 'another test post by @somebody #no3',
        mentions: '["somebody"]',
        tags: '["no3"]',
        like_count: 0,
        comment_count: 10,
        username: 'johndoe',
    },
];


const sampleComments = [
    {
        message: 'a comment',
        username: 'kodejuice',
        likes: 0,
        comment_id: 1,
        auth_user_likes: 0,
        profile_pic: 'kodejuice.png',
        created_at: new Date().toString(),
    }, {
        message: '@kodejuice, what does "a comment" mean',
        username: 'johndoe',
        likes: 0,
        comment_id: 2,
        auth_user_likes: 0,
        profile_pic: 'johndoe.jpg',
        created_at: new Date().toString(),
    }
];


const johndoeProfile = {
    username: 'jondoe',
    profile_pic: 'image.png',
    auth_user_follows: 0,
    follows_auth_user: 0,
    full_name: "John Doe"
};



/////////////////////
/////////////////////
// Server mockup
const server = setupServer(

    // GET

    // post data
    rest.get('/api/post/1', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts[0])
        )
    }),

    // post comments
    rest.get('/api/post/1/comments', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleComments)
        )
    }),

    // more posts from same user (johndoe)
    rest.get('/api/user/johndoe/posts', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(samplePosts)
        )
    }),

    // johndoe profile
    rest.get('/api/user/johndoe', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(johndoeProfile)
        )
    }),

    // like post
    rest.get('/api/post/1/like', (req, res, ctx) => {
        samplePosts[0].like_count += 1;
        return res(ctx.status(200), ctx.json({message: 'Done'}))
    }),

    // like comment
    rest.get('/api/comment/1/like', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({message: 'Done'}))
    }),
    rest.get('/api/comment/1/like', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({message: 'Done'}))
    }),

    // dislike comment
    rest.get('/api/comment/2/dislike', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({message: 'Done'}))
    }),
    rest.get('/api/comment/2/dislike', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({message: 'Done'}))
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


test("displays post", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('post-card');
    await screen.findByRole('user-dp');
    await screen.queryAllByRole('dp');
    await screen.findByRole('carousel-child');
    await screen.findByRole('video-player');
    await screen.findByRole('post-info-card');

    // like button works
    expect(getByTestId('likes-count')).toHaveTextContent('0 likes');
    fireEvent.click(getByTestId('like-btn'));
    expect(getByTestId('likes-count')).toHaveTextContent('1 likes');
});


test("displays post comments", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('comments');

    expect(getByTestId('comment-count')).toHaveTextContent('10 comments');
    expect(getByTestId('caption')).toHaveTextContent('hello world');

    await screen.queryAllByRole('user-comment');

    const comments = await screen.queryAllByRole('user-comment-message');
    expect(comments[0]).toHaveTextContent('a comment');
    expect(comments[1]).toHaveTextContent('@kodejuice, what does "a comment" mean');

    //////////////////////////////
    // test comment like button //
    //////////////////////////////

    const likeButtons = await screen.queryAllByRole('comment-like-btn');
    const likes = await screen.queryAllByRole('comment-like');

    expect(likes[0]).toHaveTextContent('0 likes');
    expect(likes[1]).toHaveTextContent('0 likes');

    fireEvent.click(likeButtons[0]);
    expect(likes[0]).toHaveTextContent('1 likes');

    fireEvent.click(likeButtons[1]);
    expect(likes[1]).toHaveTextContent('1 likes');
});


test("displays more post from same user", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('more-posts-title');
    const all = await screen.queryAllByRole('post');
    await screen.queryAllByRole('media-info');

    // will be 1 less because the post beign viewed will be removed
    // from the list
    expect(all.length).toEqual(samplePosts.length - 1);

});
