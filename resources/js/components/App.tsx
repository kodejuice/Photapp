import React, {useState, useEffect} from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from './NotFound';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Splash from './Splash';

const App: React.FC<{}> = ()=>{
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    });

    // display a splash screen if not mounted yet
    return !mounted ?
        (
            <Splash color='grey' />
        )
        :
        (
            <main>
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    {/*<Route path="/:username" component={UserProfile} />*/}
                    <Route component={NotFound} />
                </Switch>
            </main>
        )
}


export default App;
