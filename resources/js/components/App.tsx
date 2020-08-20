import React, {useState, useEffect} from 'react';
import { Route, Switch } from 'react-router-dom';

import ProgressRoute from '../routes/ProgressRoute';

import routes from '../routes';
import Splash from '../components/Splash';


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
                    {routes.map((prop, i)=>
                        <ProgressRoute key={i} {...prop} />
                    )}
                </Switch>
            </main>
        )
}


export default App;
