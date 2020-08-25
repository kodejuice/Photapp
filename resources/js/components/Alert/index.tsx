import React from 'react';

/**
 * Alert component,
 * displayed in the <Header /> component
 */

const Msg: React.FC<{message: string, id: number, type: string}> = ({message, id, type}) => (
    <div className="alert-popup" style={{bottom: `${50 + (id * 32)}px`}}>
        <div className="row flex-spaces">
            <input className="alert-state" id={`alert-${id}`} type="checkbox" />
            <div className={`alert alert-${type} dismissible`}>
                {message}
                <label className="btn-close" htmlFor={`alert-${id}`}>X</label>
            </div>
        </div>
    </div>
);


const Alert: React.FC<{message: string[], type: 'error'|'success'}> = ({type, message})=>{
    const types = {
        'error': 'danger',
        'success': 'secondary',
    };

    return (
        <React.Fragment>
            {message.map((err, i) => (
                <Msg message={err} key={err} id={i} type={types[type]} />
            ))}
        </React.Fragment>
    );
};


export default Alert;
