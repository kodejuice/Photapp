import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '.../../../__test__/wrap-component';

import LazyPost from '../index';

const component = (
    <Wrapper>
        <LazyPost post_id={1} />
    </Wrapper>
);


/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.get('/api/post/1', (req, res, ctx) => {
        // console.log(req)
        return res(
            ctx.status(200),
            ctx.json({
                post_url: '[["img", "http://example.com/post-image.png"]]',
                media_type: '["image"]'
            })
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


test("component works correctly", async ()=>{
    const {getByTestId} = render(component);
    const img = getByTestId('post-img');

    await screen.findByRole('post-img');

    // post image loaded
    expect(img.src).toEqual('http://example.com/post-image.png');
});
