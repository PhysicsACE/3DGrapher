import React, {useState, useEffect} from 'react';
import { css } from '@emotion/css';

import Slider from '@material-ui/core/Slider';

import { InlineMath } from 'react-katex';
import EquationInput from './EquationInput'
import Variable from './Variable';


export default function Sidebar({equation, variables, equationChange, variableChange, changeValue, setPlay, stopPlay}) {


    return <div className={css`
        // min-width: 30vw;
        // max-width: 300px;
        // background-color: white;
        background-color: white;
        z-index: 100;
        box-shadow: 2px 2px 8px hsla(200, 10%, 10%, 0.3);

        @media (min-width: 601px) {
            right: unset;
            bottom: 0;
            max-width: 350px;
            width: 35vw
        }
    `}>
        {/* <span>{atoms}{atoms > 1 ? ' atoms' : ' atom'}</span>
        <Slider
            value={atoms}
            onChange={(e, v) => setSpin(v+1)}
            step={1}
            min={1}
            max={MAX_SPIN-1}
        />

        <Header>Spin Decomposition</Header>
        <InlineMath>{decomposition(atoms)}</InlineMath>

        <div className={css`
            @media (max-width: 1000px) {
                display: none;
            }
        `}>
            <Header>Observables</Header>
            <Observables spin={spin} amplitudes={amplitudes}/>

            <Header>Stretched Representation Amplitudes</Header>
            <Amplitudes spin={spin} amplitudes={amplitudes} setAmplitude={setAmplitude}/>
        </div> */}
        <div className='scrollWrapper'>
            <EquationInput equationChange={equationChange} value={equation}/>
            <div className="variableHeader">Variables</div>
            {Object.keys(variables).map(element => {
                return (
                    <Variable key={element} letter={element} variableChange={variableChange} variableInfo={variables[element]} changeValue={changeValue} setPlay={setPlay} stopPlay={stopPlay}/>
                )
            })}
        </div>
    </div>;
};
