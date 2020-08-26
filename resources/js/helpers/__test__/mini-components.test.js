import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';

import {HighlightMentions} from '../mini-components';


/////////////////////
/////////////////////
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (args[0].includes("incorrect casing") || args[0].includes("uppercase letter")) {
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


test("renders without failing", ()=>{
    const strs = [
        "sample string",
        "",
        "hello",
        "i know @johndoe",
        "i met @satoshi_nakamoto at shangai",
        "will this @test work",
        "@it_wont",
        "hi",
        "00@00@00",
        "@@h",
    ];
    const div = document.createElement('div');

    strs.map((v)=>{
        ReactDOM.render(<HighlightMentions str={v}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
