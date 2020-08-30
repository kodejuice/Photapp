import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import '@testing-library/jest-dom';

import {ProcessUserInput} from '../mini-components';


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
        "hey @mike did u see that #dog runnning across the street #crazy_dog",
        "http://kodejuice.now.sh is now live i guess :/ #LIVE !!!",
    ];
    const div = document.createElement('div');

    strs.map((v)=>{
        ReactDOM.render(<ProcessUserInput text={v}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
