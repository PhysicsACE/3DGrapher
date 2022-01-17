import { PrattParser } from "./prattParser";
import { TokenContext } from "./tokenContext";
import { SyntaxNode } from "./syntaxNode";
import { TokenStream } from "./tokenstream";

export function parseEquation(equation) {
    var equals = (equation.match(/=/g) || []).length
    var lhs = ''
    var rhs = ''
    var parsed

    if (equals === 0) {
        lhs = equation
    } else if (equals > 1) {
        throw new Error('Cannot have more than 1 equal sign')
    } else {
        var splitted = equation.split('=')
        lhs = splitted[0].trim()
        rhs = splitted[1].trim()
    }
    console.log(lhs)
    console.log(rhs)

    if (lhs === 'z') {
        console.log('yes')
        parsed = parseInput(rhs)
        if (parsed.error) {
            return parsed.error
        }
        return {parsed: parsed, type: 'explicit'}
    }

    if (rhs === 'z') {
        parsed = parseInput(lhs)
        if (parsed.error) {
            return parsed.error
        }
        return {parsed: parsed, type: 'explicit'}
    }

    var input = rhs + ' - ' + lhs
    parsed = parseInput(input)
    if (parsed.error) {
        return parsed.error
    }
    return {parsed: parsed, type: 'implicit'}
}

function parseInput(input) {
    input = input.trim()
    if (input.length === 0) {
        return {error: ''}
    }

    var tokens
    try {
        tokens = new TokenStream(input).tokens()
    } catch (e) {
        return {error: e.message}
    }

    console.log(tokens)
    var context = new TokenContext(tokens)
    var parser = new PrattParser(context)
    parser.registerTerminal('NUMBER', 3)
    parser.registerTerminal('NAME', 2)
    parser.registerTerminal('TOP', 2)
    parser.registerPrefixUnary('PLUS')
    parser.registerPrefixUnary('MINUS')
    parser.registerBinary('PLUS', 3)
    parser.registerBinary('MINUS', 3)
    parser.registerBinary('MUL', 4)
    parser.registerBinary('DIV', 4)
    parser.registerBinary('MOD', 4)
    parser.registerBinary('POW', 5)
    parser.registerPrefix('LEFT_PAREN', function(parser, token) {
        var peek = parser.peek()
        if (peek && peek.value === ')') {
            throw new Error("Empty pair of parentheses")
        }
        var parts = []
        var expr = parser.parse(0)
        if (!expr) {
            throw new Error("Cannot parse that")
        }
        parts.push(expr)
        while (parser.consume('COMMA')) {
            var expr1 = parser.parse(0)
            if (!expr1) {
                throw new Error("Cannot parse that")
            }
            parts.push(expr1)
        }
        if (!parser.consume('RIGHT_PAREN')) {
            return new Error("Missing a right parenthesis")
        }

        var node = new SyntaxNode(parts.length === 1 ? 4 : 8)
        node.setChildren(parts)
        return node
    })
    parser.registerInfix('LEFT_PAREN', 8, function (parser, left, token) {
        var children = []
        children.push(left)
        while (parser.peek().type !== 'RIGHT_PAREN') {
            var expr = parser.parse(0)
            if (!expr) {
                console.log('h')
                return {error: 'Could not parse that'}
            }
            children.push(expr)
            parser.consume('COMMA')
        }
        if (!parser.consume('RIGHT_PAREN')) {
            return {error: 'Missing right parenthesis'}
        }

        var node = new SyntaxNode(1)
        node.setChildren(children)
        return node
    })

    var root = null
    var error = null
    try {
        root = parser.parse(0)
    } catch (e) {
        console.log(e)
        return {error: 'Could not parse that'}
    }


    if (!error && context.hasRemaining()) {
        console.log('i')
        return {error: "Could not parse that"}
    }

    if (error !== null) {
        return {error: error}
    }

    return {root: root, error: null}


}