import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Wrapper from '../../../../__test__/wrap-component';

import App from '../../../../components/App';

window.__JEST_TEST_ENV = true;
window.__page = "profile";

const component = (
    <Wrapper>
        <App path="accounts" />
    </Wrapper>
);


const profileData = {
    id: 1,
    username: 'johndoe',
    email: 'sampleEmail',
    full_name: 'JohnDoe',
    profile_pic: 'johndoe.jpeg',
    followers: Infinity,
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


test('renders without crashing', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(component, div);
});


test("displays users profile info on page render", async ()=>{
    const {getByTestId} = render(component);

    await screen.findByRole('app-logged');
    await screen.findByRole('user-info');

    await screen.findByRole(`name-${profileData.full_name}`);
    // await screen.findByRole(`email-${profileData.email}`);

});
