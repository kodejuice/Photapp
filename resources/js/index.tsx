import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux'
import allReducers from './state/reducers';

// redux store
const _window = window as any;
const store = createStore(
    allReducers,
    _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__(),
);

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// 1534 3134 8350 7343
