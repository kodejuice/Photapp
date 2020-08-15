import React from 'react';

/**
 * Splash screen component,
 * displayed while page isnt mounted yet
 */

const centerVertically: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
};

const bgSplash: (t: 'bw'|'grey'|'clr') => React.CSSProperties = (t) => ({
    backgroundImage: `url(splash/splash-${t}.png)`,
    width: '170px',
    height: '170px',
    backgroundPosition: 'center',
    backgroundSize: '170px'
});


const Splash: React.FC<{color: 'bw'|'grey'|'clr'}> = ({color})=>{
    const name: string = "homw";

    return (
        <main>
            <div className="splash">
                <div style={centerVertically}>
                    <div style={bgSplash(color)}></div>
                </div>
            </div>
        </main>
    );
}


export default Splash;
