import React, {useState} from 'react'
import './styles.css'

function RightNumberInput ({valChange, value}) {

    const [isEditing, setIsEditing] = useState(false)
    const [max, setMax] = useState(1)

    return (
        <input className='maxLimit' type='text' defaultValue={value.toString()} onChange={e => valChange(e.target.value)} style={{textAlign: 'center'}}/>
    )
}

export default RightNumberInput