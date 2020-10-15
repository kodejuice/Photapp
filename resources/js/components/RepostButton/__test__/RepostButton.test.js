import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '.../../../__test__/wrap-component';

import RepostButton from '../index';

window.__JEST_TEST_ENV = true;
window.confirm = ()=>true;

const component = (
    <Wrapper>
        <RepostButton
            username='johndoe'
            post_id={1}
        />
    </Wrapper>
);

const samplePosts = [{
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
}];

/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.post('/api/post/1/repost', (req, res, ctx) => {
        samplePosts.push(samplePosts[0]);
        return res(
            ctx.status(200),
            ctx.json({message: "Success"})
        )
    }),
);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
/////////////////////
/////////////////////



test('renders without crashing', ()=>{
    render(component);

    // const div = document.createElement('div');
    // ReactDOM.render(component, div);
});


test("can repost", async ()=>{
    const {getByTestId} = render(component);

    fireEvent.click(getByTestId('repost-btn'));
    await screen.findByRole('reposted');

    expect(samplePosts.length).toEqual(2);
});
