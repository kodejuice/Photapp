import React, {useState} from 'react';

/**
 * Alert component,
 * displayed in the <Header /> component
 */

const Msg: React.FC<{message: string, id: number, type: string}> = ({message, id, type}) => {
    const [shown, setShown] = useState(true);

    return (
        shown?
        <div data-testid="alert-popup" className="alert-popup" style={{bottom: `${50 + (id * 32)}px`}}>
            <div className="row flex-spaces">
                <input className="alert-state" id={`alert-${id}`} type="checkbox" />
                <div className={`alert alert-${type} dismissible`}>
                    <span data-testid='alert-message'>{message}</span>
                    <label data-testid="close-popup" className="btn-close" onClick={_=>setShown(!shown)} htmlFor={`alert-${id}`}>X</label>
                </div>
            </div>
        </div>
        : <React.Fragment></React.Fragment>
    );
}


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
