import React from 'react';

const NotFound: React.FC<{}> = ()=>{
    const name: string = "homw";

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <big> <b>404</b> </big>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default NotFound;
