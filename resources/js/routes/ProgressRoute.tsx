import React from 'react'
import { Route } from 'react-router-dom'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './ProgressRoute.scss'


interface RouteProps {
    component?: React.ComponentType<any>;
    path?: string | string[];
    exact?: boolean;
}


const ProgressRoute: React.FC<RouteProps> = (props) => {
    // componentWillMount
    React.useState(nprogress.start());

    React.useEffect(() => {
        // componentDidMount
        nprogress.done();
        return () => nprogress.start();
    });

    return (
        <Route {...props} />
    );
}


export default ProgressRoute;
