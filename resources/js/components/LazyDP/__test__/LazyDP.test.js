import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '.../../../__test__/wrap-component';

import LazyDP from '../index';

const component = (
    <Wrapper>
        <LazyDP user='fake_user' />
    </Wrapper>
);


/////////////////////
/////////////////////
// Server mockup
const server = setupServer(
    rest.get('/api/user/getprofile', (req, res, ctx) => {
        // console.log(req)
        return res(
            ctx.status(200),
            ctx.json({username: 'fake_user', profile_pic: "fake_user_dp_image.png"})
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
    const img = getByTestId('dp');

    await screen.findByRole('dp');

    // user image loaded
    expect(img.src.includes('fake_user_dp_image.png')).toEqual(true);
});
