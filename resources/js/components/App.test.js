import React from 'react';
import ReactDOM from 'react-dom';
import {render, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../__test__/wrap-component';

import App from './App';

const component = (
    <Wrapper>
        <App />
    </Wrapper>
);

const profileData = {
    id: 1,
    username: 'johndoe',
    email: 'johndoe@example.com',
    full_name: 'John Doe',
    profile_pic: 'johndoe.jpeg',
    followers: Infinity, // :)
    follows: -Infinity,
    posts_count: 0,
}



/////////////////////
/////////////////////
// Server mockup
const server = setupServer(

    // GET
    rest.get('/api/user/profile', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(profileData)
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


// test('renders without crashing', ()=>{
//     const div = document.createElement('div');
//     ReactDOM.render(component, div);
// });


test("gets user info onAppLoaded", async ()=>{
    const {getByTestId} = render(component);
    await screen.findByRole('app-logged');
});
