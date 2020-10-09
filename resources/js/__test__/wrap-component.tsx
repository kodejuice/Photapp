import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux'

import allReducers from '../state/reducers';

// we wrap out test component with
// react-router and redux

// redux store
const store = createStore(allReducers);

const Wrap: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <Router>
            <Provider store={store}>
                {children}
            </Provider>
        </Router>
    );  
}


/////////////////////
/////////////////////
const originalError = console.error;
console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) return
    if (/Warning.*Cannot update a component/.test(args[0])) return
    if (/Error.*socket hang up/.test(args[0])) return;
    originalError.call(console, ...args)
}
/////////////////////
/////////////////////


(window as any).Store = {
    'uploaded_file_url': new Map(),
    'swr_map': new Map(),
    'memoizer': new Map(),
    'posts': new Map(),
    'grid_thumnails': new Map(),
};


export default Wrap;
