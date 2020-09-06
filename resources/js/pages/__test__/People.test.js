import React from 'react';
import ReactDOM from 'react-dom';
import {render, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../__test__/wrap-component';

import People from '../People';

window.__JEST_TEST_ENV = true;

const component = (
    <Wrapper>
        <People />
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


test("properly renders all users", async ()=>{
    const {getByTestId} = render(component);

    await screen.queryAllByRole('user');
});

