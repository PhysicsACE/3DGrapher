import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';

import 'katex/dist/katex.min.css';

import ResponsiveCanvas from './components/ResponsiveCanvas';
import Sidebar from './components/Sidebar';

import { start, resize } from './Logic/render';
import { Parser } from 'expr-eval';
import { createGraph, resetCam } from './Logic/render';
import { Typography, Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import ToolBar from './components/toolbar';
import { randomEq } from './Logic/random';
import { constants, TokenStream } from 'Logic/Parser/tokenstream';
import { parseEquation } from 'Logic/Parser/parseEquation';
import { codegen, generateJSFunction } from 'Logic/Parser/codegen';

var parsedvar

function getNewVar(l1, l2) {
  const newvar = []
  for (let v = 0; v < l1.length; v++) {
    if (l2.includes(l1[v]) === false && l1[v] !== 'x' && l1[v] !== 'y') {
      newvar.push(l1[v])
    }
  }

  return newvar
}

function checkVar(v, implicit = false) {
  if (implicit) {
    return v !== 'x' && v !== 'y' && v !== 'z'
  } 

  return v !== 'x' && v !== 'y'
}

function checkSubImplicit(split) {
  try {
    var expr1 = Parser.parse(split[0])
    var expr2 = Parser.parse(split[1])
    return true
  } catch (e) {
    return false
  }
}


function App() {

  const [equation, setEquation] = useState('')
  const [parsedexpr, setExpr] = useState('')
  const [variables, setVariables] = useState({})
  const [playing, setPlaying] = useState([])
  const [graphType, setGraphType] = useState('')
  const [modalState, setModalState] = useState(false)

  const setPlay = (letter) => {
    const temp = [...playing]
    temp.push(letter)
    setPlaying(temp)
  }

  const stopPlay = (letter) => {
    const temp = [...playing]
    const idx = temp.indexOf(letter)
    temp.splice(idx, 1)
    setPlaying(temp)
  }

  const triggerModal = () => {
    setModalState(true)
  }

  const closeModal = () => {
    setModalState(false)
  }

  useEffect(() => {

    
    var eq = 'z = sin(x) + b'
    var eq2 = 'z = x + y'
    var instr = []
    // var parserState = new ParserState(new TokenStream(eq))

    var parsed = parseEquation(eq)
    // console.log(codegen(parsed.parsed.root, {'b': 5, c: 10}))
    var parsed2 = parseEquation(eq2)
    var jsparsed = generateJSFunction("x,y", parsed.parsed.root, {b: 0})
    console.log(jsparsed(0, 6))
    // parserState.parseExpression(instr)
    // console.log(instr)

    const split = equation.split('=')
    if (split.length !== 2) {
      return
    } else {
      console.log(split)
      if (split.includes('z') || split.includes('z ')) {
        setGraphType('default')
        if (split.includes('') || split.includes(' ')) {
          return
        }
        var idx = null
        if (split.includes('z')) {
          idx = split.indexOf('z')
        } else {
          idx = split.indexOf('z ')
        }
        const exprIdx = idx === 0 ? 1 : 0
        const expr = split[exprIdx]
        setExpr(expr)
        console.log(idx)
        console.log(exprIdx)
        console.log(expr)
        try {
          parsedvar = Parser.parse(expr).variables().filter(checkVar)
          console.log(parsedvar)
          if (parsedvar.length != Object.keys(variables).length) {
            if (parsedvar.length > Object.keys(variables).length) {
              const newvar = getNewVar(parsedvar, Object.keys(variables))
              const oldvar = JSON.parse(JSON.stringify(variables))
              for (let v = 0; v < newvar.length; v++) {
                oldvar[newvar[v]] = [0, 1, 0.5, false]
              }
              setVariables(oldvar)
            } else {
              const newvar = getNewVar(Object.keys(variables), parsedvar)
              const oldvar = JSON.parse(JSON.stringify(variables))
              for (let v of newvar) {
                delete oldvar[v]
              }
              setVariables(oldvar)
            }
          } else if (parsedvar.sort() !== Object.keys(variables).sort()) {
            const newvar = getNewVar(parsedvar, Object.keys(variables))
            const removevar = getNewVar(Object.keys(variables), parsedvar)
            const oldvar = JSON.parse(JSON.stringify(variables))
            for (let v of removevar) {
              delete oldvar[v]
            }
            for (let v = 0; v < newvar.length; v++) {
              oldvar[newvar[v]] = [0, 1, 0.5, false]
            }
            setVariables(oldvar)
          }
    
          createGraph(equation, variables, graphType)
    
        } catch(error) {
          console.log(error)
        }
      } else if (split.includes('0') || split.includes('0 ')) {
          setGraphType('implicit')
          if (split.includes('') || split.includes(' ')) {
            return
          }
          var idx = null
          if (split.includes('0')) {
            idx = split.indexOf('0')
          } else {
            idx = split.indexOf('0 ')
          }
          const exprIdx = idx === 0 ? 1 : 0
          const expr = split[exprIdx]
          setExpr(expr)

          try {
            parsedvar = Parser.parse(expr).variables().filter(checkVar, true)
            console.log(parsedvar)
            if (parsedvar.length != Object.keys(variables).length) {
              if (parsedvar.length > Object.keys(variables).length) {
                const newvar = getNewVar(parsedvar, Object.keys(variables))
                const oldvar = JSON.parse(JSON.stringify(variables))
                for (let v = 0; v < newvar.length; v++) {
                  oldvar[newvar[v]] = [0, 1, 0.5, false]
                }
                setVariables(oldvar)
              } else {
                const newvar = getNewVar(Object.keys(variables), parsedvar)
                const oldvar = JSON.parse(JSON.stringify(variables))
                for (let v of newvar) {
                  delete oldvar[v]
                }
                setVariables(oldvar)
              }
            } else if (parsedvar.sort() !== Object.keys(variables).sort()) {
              const newvar = getNewVar(parsedvar, Object.keys(variables))
              const removevar = getNewVar(Object.keys(variables), parsedvar)
              const oldvar = JSON.parse(JSON.stringify(variables))
              for (let v of removevar) {
                delete oldvar[v]
              }
              for (let v = 0; v < newvar.length; v++) {
                oldvar[newvar[v]] = [0, 1, 0.5, false]
              }
              setVariables(oldvar)
            }

            createGraph(equation, variables, graphType)
      
          } catch(error) {
            console.log(error)
          }
      } else if (checkSubImplicit(split)) {
        var expr = split[1].trim() + " - (" + split[0].trim() + ')'
        console.log(expr)
        setGraphType('implicit')
        setExpr(expr)
        try {
          parsedvar = Parser.parse(expr).variables().filter(checkVar, true)
          console.log(parsedvar)
          if (parsedvar.length != Object.keys(variables).length) {
            if (parsedvar.length > Object.keys(variables).length) {
              const newvar = getNewVar(parsedvar, Object.keys(variables))
              const oldvar = JSON.parse(JSON.stringify(variables))
              for (let v = 0; v < newvar.length; v++) {
                oldvar[newvar[v]] = [0, 1, 0.5, false]
              }
              setVariables(oldvar)
            } else {
              const newvar = getNewVar(Object.keys(variables), parsedvar)
              const oldvar = JSON.parse(JSON.stringify(variables))
              for (let v of newvar) {
                delete oldvar[v]
              }
              setVariables(oldvar)
            }
          } else if (parsedvar.sort() !== Object.keys(variables).sort()) {
            const newvar = getNewVar(parsedvar, Object.keys(variables))
            const removevar = getNewVar(Object.keys(variables), parsedvar)
            const oldvar = JSON.parse(JSON.stringify(variables))
            for (let v of removevar) {
              delete oldvar[v]
            }
            for (let v = 0; v < newvar.length; v++) {
              oldvar[newvar[v]] = [0, 1, 0.5, false]
            }
            setVariables(oldvar)
          }

          createGraph(equation, variables, graphType)
    
        } catch(error) {
          console.log(error)
        }
      } else if (!equation) {
        setVariables({})
      } else {
        return
      }
    }

  }, [equation])


  const changeVar = (letter, info) => {
    const oldvar = JSON.parse(JSON.stringify(variables))
    oldvar[letter] = info
    setVariables(oldvar)
  }

  const changeValue = (letter, info) => {
    const oldvar = JSON.parse(JSON.stringify(variables))
    oldvar[letter] = info
    setVariables(oldvar)
    createGraph(equation, variables, graphType)

  }

  const getStep = (letter) => {
    return (variables[letter][1] - variables[letter][0]) / 100
  }

  const nextValue = (letter) => {
    if (variables[letter][2] >= variables[letter][1]) {
      return variables[letter][0]
    } else {
      return variables[letter][2] += getStep(letter)
    }
  }

  const setRandom = () => {
    const random = randomEq()
    setEquation(random[0])
    setVariables(random[1])
  }

  const animateVariables = () => {
    for (const letter of playing) {
      const temp = [...variables[letter]]
      temp[2] = nextValue(letter)
      changeValue(letter, temp)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      animateVariables()
    }, 50)
    return () => clearInterval(interval)
  }, [playing])





  return (
    <>
      <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
        <ToolBar resetCam={resetCam} triggerModal={triggerModal} randomFunc={setRandom}/>
        <div className={css`
              width: 100%;
              // height: 100%;

              display: flex;
              flex-direction: row;
              flex-grow: 1;

              @media (max-width: 1000px) {
                  flex-direction: column;
              }`}>
              <Sidebar
                  equation={equation}
                  variables={variables}
                  equationChange={setEquation}
                  variableChange={changeVar}
                  changeValue={changeValue}
                  setPlay={setPlay}
                  stopPlay={stopPlay}
              />
              <ResponsiveCanvas
                  onResize={resize}
                  start={start}
              />
        </div>
      </div>
      <Dialog open={modalState} onClose={closeModal}>
        <DialogTitle>
          About
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              Welcome to 3Dgrapher. Type in an expression in the textarea either as a function of z or implicitly. To animate variables, click on the variable letter and to see some examples, click the random equation button on the top bar. You can change the range of the variables by alterings the min and max boxes and move the canvas around to see the curve from different angles. If lost, you can reset the camera to the original position by clicking the reset button on the top.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default App;
