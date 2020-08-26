import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Cookie from 'js-cookie';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../../__test__/wrap-component';

import Register from '../Register';

const component = (
    <Wrapper>
        <Register />
    </Wrapper>
);


/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.post('/api/register', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({token: 'fake_user_token'})
        )
    }),
);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => {
    server.close()
    Cookie.remove("AUTH_TOKEN")
})
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


test("toggling password visibility works correctly", ()=>{
    const {getByTestId} = render(component);
    const button = getByTestId('show-pass');

    expect(button).toHaveTextContent("Show");
    fireEvent.click(button);
    expect(button).toHaveTextContent("Hide");
});


test("signs user up", async ()=>{
    const {getByTestId} = render(component);

    // fill out the form
    fireEvent.change(getByTestId('email-input'), {
        target: {value: 'johndoe@example.com'},
    })
    fireEvent.change(getByTestId('user-input'), {
        target: {value: 'john'},
    })
    fireEvent.change(getByTestId('pass-input'), {
        target: {value: 'doe-pass'},
    })
    fireEvent.change(getByTestId('fullname-input'), {
        target: {value: 'John Doe'},
    })

    // submit form
    fireEvent.click(getByTestId('submit'));

    // wait 
    await screen.findByRole('alert');

    expect(Cookie.get("AUTH_TOKEN")).toEqual('fake_user_token');
});
