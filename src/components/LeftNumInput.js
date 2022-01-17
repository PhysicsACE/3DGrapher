import React from 'react'
import './styles.css'

function LeftNumberInput ({valChange, value}) {
    return (
        <input className='minLimit' type='text' defaultValue={value.toString()} onChange={e => valChange(e.target.value)} style={{textAlign: 'center'}}/>
    )
}

export default LeftNumberInput