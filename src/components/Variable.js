import React, {Component} from 'react'
import './styles.css'
import LeftNumberInput from './LeftNumInput'
import RightNumberInput from './RightNumInput'
// import Slider from './Slider'
import {Slider, withStyles} from '@material-ui/core'

const NumSlider = withStyles({
    root: {
        color: '#faf0e6',
        height: 8,
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
          boxShadow: 'inherit',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
      },
      track: {
        height: 8,
        borderRadius: 4,
      },
      rail: {
        height: 8,
        borderRadius: 4,
      },
})(Slider)

const animationDuration = 10


class Variable extends Component {

    state={
      step: (this.props.variableInfo[1] - this.props.variableInfo[0]) / 100,
      playing: false
    }

    constructor(props) {
        super(props)
        console.log(this.props.variableInfo[2])
    }

    // componentDidUpdate() {
    //   if (this.props.variableInfo[3] && this.props.variableInfo[1] !== this.props.variableInfo[2]) {
    //     this.nextValue(this.props.variableInfo[2] + this.state.step)
    //   }
    // }

    onMinChange = (start) => {
        const temp = parseFloat(start)
        if (temp !== NaN) {
          this.props.variableInfo[0] = temp
          this.props.variableChange(this.props.letter, this.props.variableInfo)
        }
    }

    componentDidUpdate() {
      if (this.state.playing) {
        this.onAnimate(this.nextValue())
      }
    }

    onMaxChange = (stop) => {
      const temp = parseFloat(stop)
      if (temp !== NaN) {
        this.props.variableInfo[1] = temp
        this.props.variableChange(this.props.letter, this.props.variableInfo)
      }
    }

    onAnimate = (curr) => {
      console.log(curr)
      this.props.variableInfo[2] = curr
      this.props.changeValue(this.props.letter, this.props.variableInfo)
    }

    onValueChange = (curr) => {
      console.log(curr)
      if (this.props.variableInfo[3]) {
        this.props.variableInfo[3] = false
        this.props.stopPlay(this.props.letter)
      }
      this.props.variableInfo[2] = curr
      this.props.changeValue(this.props.letter, this.props.variableInfo)
    }


    startPlaying = () =>  {
      if (this.props.variableInfo[3]) {
        this.props.stopPlay(this.props.letter)
        this.props.variableInfo[3] = false
        this.props.variableChange(this.props.letter, this.props.variableInfo)
      } else {
        this.props.setPlay(this.props.letter)
        this.props.variableInfo[3] = true
        this.props.variableChange(this.props.letter, this.props.variableInfo)
      }
    }

    render () {
        return (
            <div className='container'>
                <div className={'variableName-' + this.props.variableInfo[3]} onClick={this.startPlaying}> {this.props.letter} </div>
                <LeftNumberInput value={this.props.variableInfo[0]} valChange={this.onMinChange}/>
                <NumSlider min={this.props.variableInfo[0]} max={this.props.variableInfo[1]} value={this.props.variableInfo[2]} onChange={(e, v) => this.onValueChange(v)} step={this.state.step} />
                <RightNumberInput value={this.props.variableInfo[1]} valChange={this.onMaxChange}/>
            </div>
        )
    }
}

export default Variable