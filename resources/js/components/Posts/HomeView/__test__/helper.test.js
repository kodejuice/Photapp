import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import "babel-polyfill";
import '@testing-library/jest-dom';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {
    copyToClipboard,
    likePost,
    deletePost,
    savePost,
} from '../helper';

window.confirm = ()=>true;
window.alert = ()=>false;
console.error = ()=>null;

/////////////////////
/////////////////////
// Server mockup
let A=0, B=0, C=0;
const server = setupServer(
    rest.post('/api/post/1/like', (req, res, ctx) => {
        A += 1;
        return res(
            ctx.status(200),
            ctx.json({
                message: A==1 ? "Done" : "Error"
            })
        )
    }),

    rest.post('/api/post/1/save', (req, res, ctx) => {
        B += 1;
        return res(
            ctx.status(200),
            ctx.json({
                message: B==1 ? "Done" : "Error"
            })
        )
    }),

    rest.delete('/api/post/1', (req, res, ctx) => {
        C += 1;
        return res(
            ctx.status(200),
            ctx.json({
                message: C==1 ? "Post deleted" : "Error"
            })
        )
    }),

);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
/////////////////////
/////////////////////


test("copyToClipboard works as expected", ()=>{
    let originalExec = document.execCommand

    copyToClipboard("hello world", ()=>null);

    document.execCommand = ()=>true;
    copyToClipboard("hello world", ()=>null);

    document.execCommand = originalExec;
});

test("likePost works as expected", async ()=>{
    let r = await likePost(1, ()=>false, {});
    expect(r).toEqual(true);
});

test("savePost works as expected", async ()=>{
    let r = await savePost(1, ()=>false, {});
    expect(r).toEqual(true);
});

test("deletePost works as expected", async ()=>{
    let r = await deletePost(1);
    expect(r).toEqual(true);
});

test("error returns", async ()=>{
    expect(await likePost(1, ()=>false, {})).toEqual(false);
    expect(await savePost(1, ()=>false, {})).toEqual(false);
    expect(await deletePost(1)).toEqual(false);
});
