import React from 'react';

const Register: React.FC<{}> = () => {
    const name: string = "Register";

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


export default Register;
