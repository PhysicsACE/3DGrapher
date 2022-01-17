import { SyntaxNode } from "./syntaxNode"

export const unaryOps = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: Math.acosh,
    atanh: Math.atanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    log: Math.log,
    log2: Math.log2,
    ln: Math.log,
    lg: Math.log10,
    log10: Math.log10,
    expm1: Math.expm1,
    log1p: Math.log1p,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    trunc: Math.trunc,
}

export function codegen(root, options) {
    if (options === void 0) {
        options = {}
    }
    var s = ''
    console.log(root)
    if (root.type === 1) {
        var func = root.firstChild()
        var funcName = func.token.value
        var jsVal = unaryOps[funcName]
        if (!jsVal) {
            return new Error("The operator " + funcName + " is not supported")
        }
        s += 'Math.' + funcName + '('
        var arg = root.secondChild()
        if (!arg) {
            return new Error("Missing argument for function " + funcName)
        }
        s += codegen(arg, options)
        s += ')'
    } else if (root.type === 2) {
        console.log(root.token)
        if (root.token.type === 'NAME') {
            if (root.token.value in options) {
                s += options[root.token.value]
                return s
            }
        }
        s += root.token.value
    } else if (root.type === 3) {
        s += root.token.value
    } else if (root.type === 4) {
        s += '('
        s += codegen(root.firstChild(), options)
        s += ')'
    } else if (root.type === 5) {
        s += root.token.type
        s += codegen(root.firstChild(), options)
    } else if (root.type === 6) {
        if (root.token.type === 'POW') {
            s += 'Math.pow('
            s += codegen(root.firstChild(), options)
            s += ', '
            s += codegen(root.secondChild(), options)
            s += ')'
            return s
        }

        var op = root.token.value
        s += codegen(root.firstChild(), options)
        s += ' ' + op + ' '
        var rhs = root.childAtId(1)
        if (!rhs.isGroup() && !rhs.isLeaf()) {

            const createNode = (child) => {
                var node = new SyntaxNode(4)
                node.setChildren([child])
                return node
            }
            
            rhs = createNode(rhs)
            console.log(rhs)
        }

        s += codegen(rhs, options)

    }

    return s
}


export function generateJSFunction (param, root, options) {
    return new Function(param, 'return ' + codegen(root, options))
}