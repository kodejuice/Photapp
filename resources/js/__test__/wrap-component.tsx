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

export default Wrap;
