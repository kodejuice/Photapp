import React from 'react';
import ReactDOM from 'react-dom';
import {render, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../../../__test__/wrap-component';

import Notifications from '../index';

const component = (
    <Wrapper>
        <Notifications />
    </Wrapper>
);


const sampleNotifications = [
    {
        type: 'mention',
        new: true,
        notification_id: 1,
        message: 'mentioned you in a comment: @fake_user!',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        associated_user: 'johndoe',
        post_id: 1,
        comment_id: null,
    },

    {
        type: 'comment',
        new: true,
        notification_id: 2,
        message: 'commented on your post: Hi!',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        associated_user: 'johndoe',
        post_id: 1,
        comment_id: 1,
    },

    {
        type: 'like',
        new: true,
        notification_id: 3,
        message: 'liked on your post',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        associated_user: 'johndoe',
        post_id: 1,
        comment_id: null,
    },

    {
        type: 'follow',
        new: true,
        notification_id: 4,
        message: 'started following you',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        associated_user: 'johndoe',
        post_id: null,
        comment_id: null,
    },
];



/////////////////////
/////////////////////
// Server mockup
const server = setupServer(

    // GET
    rest.get('/api/user/notifications', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(sampleNotifications)
        )
    }),

    // DELETE
    rest.delete('/api/user/notifications', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({})
        )
    }),

    // POST
    //  update
    rest.post('/api/user/notifications', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({})
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
// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
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



test("properly renders all types of alert", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('mention-alert');
    await screen.findByRole('comment-alert');
    await screen.findByRole('like-alert');
    await screen.findByRole('follow-alert');

});
