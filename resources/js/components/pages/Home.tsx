import React from 'react';

const Home: React.FC<{}> = ({children})=>{
    const name: string = "homw";
    
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">A {name} Component</div>

                        <div className="card-body">I'm :just: a component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Home;
