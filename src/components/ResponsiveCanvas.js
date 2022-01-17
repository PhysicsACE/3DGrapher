import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';

import useWindowSize from '../hooks/windowResize';


export default function ResponsiveCanvas({onResize, start, curve}) {
    const {width, height} = useWindowSize('canvas-container');
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            start()
            setLoaded(true)
        }, 1000);
    }, [start]);
    useEffect(() => {onResize(width, height, loaded);}, [onResize, width, height]);

    return <div id='canvas-container' className={css`
        flex-grow: 1;
        overflow: hidden;
        position: relative;
    `}>
        <canvas
        id='canvas'
        width={width} height={height}
        className={css`
            display: block;
        `}
    /></div>;
};
