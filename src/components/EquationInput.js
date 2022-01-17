import React, {Component} from 'react'
import './styles.css'

const InlineStyle = {}

class EquationInput extends Component {

    state={
        equation: '',
    }

    constructor(props) {
        super(props)
        this.textareaEl = React.createRef()
        this.resize = this.resize.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        console.log(this.textareaEl.current)
    }

    newParsedEquation(props) {
        
    }

    keyDown(e) {
        e.stopPropagation()
        this.resize()
    }

    onChange(s) {
        this.resize()
        this.props.equationChange(s)
    }

    stopPropagation(e) {
        e.stopPropagation()
    }

    resize() {
        if (this.textareaEl.current) {
            this.textareaEl.current.style.height = 'auto'
            const height = this.textareaEl.current.scrollHeight
            if (window.innerWidth < 450) {
                height = Math.min(height, 30)
            }
            this.textareaEl.current.style.height = height + 'px'
        } 
    }


    render() {
        return (
            <div className="inputRoot">
                <div className="textareacontainer">
                    <textarea className="textarea" value={this.props.value} spellCheck={false} ref={this.textareaEl} onClick={this.stopPropagation} onChange={(e) => this.onChange(e.target.value)} />
                </div>
            </div>
        )
    }
}

export default EquationInput