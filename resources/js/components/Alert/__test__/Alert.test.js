import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {useDispatch} from 'react-redux';

import Wrapper from '.../../../__test__/wrap-component';

import Alert from '../index';
import showAlert from '../showAlert';

const component = (
    <Wrapper>
        <Alert message={['hello world']} type='success' />
    </Wrapper>
);


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


test("component works correctly", ()=>{
    const {getByTestId} = render(component);
    const msg = getByTestId('alert-message');
    const popup = getByTestId('alert-popup');
    const closeButton = getByTestId('close-popup');

    expect(popup).toBeInTheDocument();
    expect(msg).toHaveTextContent("hello world");

    fireEvent.click(closeButton);

    expect(popup).not.toBeInTheDocument();
});
