import React, {useState} from 'react'
import './styles.css'

export default function ToolBar ({randomFunc, resetCam, triggerModal}) {

    return (
        <div className="toolbar">
            <div className="toolbartitle">
                3DGrapher
            </div>
            <div className="toolbarcomponents">
                <div className="toolbarbutton" onClick={() => randomFunc()}>
                    Random Equation
                </div>
                <div className="toolbarbutton" onClick={() => resetCam()}>
                    Reset Camera
                </div>
                <div className="toolbarbutton" onClick={() => triggerModal()}>
                    About
                </div>
            </div>
        </div>
    )
}