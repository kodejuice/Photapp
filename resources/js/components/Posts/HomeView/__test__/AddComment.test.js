import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '.../../../__test__/wrap-component';

import AddComment from '../AddComment';

window.__JEST_TEST_ENV = true;
let comments = [{
    message: "first comment"
}];

const component = (
    <Wrapper>
        <AddComment
            post_id={1}
            mutate={(update)=>{
                if (typeof update == 'function') {
                    update(comments);
                }
            }}
        />
    </Wrapper>
);

/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.post('/api/post/1/comment', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                message: req.body.message=='fail'
                    ? "ERROR?"
                    : "Done"
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


test("can add comment", async ()=>{
    const {getByTestId} = render(component);

    fireEvent.change(getByTestId('add-comment-input'), {
        target: {value: 'hello world'},
    });
    fireEvent.click(getByTestId("add-comment-btn"));
    await screen.findByRole('no-text');

    expect(comments.length).toEqual(2);
    expect(comments[0].message).toEqual('hello world');
    comments.shift();
});


test("removes added comment onError", async ()=>{
    const {getByTestId} = render(component);

    fireEvent.change(getByTestId('add-comment-input'), {
        target: {value: 'fail'},
    });
    fireEvent.submit(getByTestId("add-comment-form"));
    await screen.findByRole('error');

    expect(comments.length).toEqual(1);
});
