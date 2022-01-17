import { SyntaxNode } from "./syntaxNode"

const Precedence = {
    Lowest: 0,
    Assignment: 1,
    Conditional: 2,
    Sum: 3,
    Product: 4,
    Exponential: 5,
    Prefix: 6,
    Postfix: 7,
    Call: 8
}

export class PrattParser {
    constructor(context) {
        this.context = context
        this.parselets = Object.create(null)
    }

    registerPrefix(type, prefixParse) {
        this.getParselet(type).prefixParse = prefixParse
    }

    registerInfix(type, infixPrecedence, infixParse) {
        console.log(infixPrecedence)
        this.getParselet(type, infixPrecedence).infixParse = infixParse
    }

    registerTerminal(type, syntaxType) {
        this.registerPrefix(type, function(parser, token) {
            var node = new SyntaxNode(syntaxType)
            node.setToken(token)
            return node
        })
    }

    registerPrefixUnary(type) {
        this.registerPrefix(type, function(parser, token) {
            var operator = parser.parse(Precedence.Prefix)
            if (!operator) {
                throw new Error("Need something after the operator" + token.value)
            }
            var node = new SyntaxNode(5)
            node.setToken(token)
            node.setChildren([operator])
            return node
        })
    }

    registerPostfixUnary(type) {
        this.registerInfix(type, function(parser, left, token) {
            var node = new SyntaxNode(7)
            node.setToken(token)
            node.setChildren([left])
            return node
        })
    }

    registerBinary(type, precedence) {
        this.registerInfix(type, precedence, function(parser, left, token) {
            var right = parser.parse(precedence)
            if (!right) {
                throw new Error("Need something after the operator" + token.value)
            }
            var node = new SyntaxNode(6)
            node.setToken(token)
            node.setChildren([left, right])
            return node
        })
    }

    getParselet(type, infixPrecedence) {
        if (infixPrecedence === void 0) {
            infixPrecedence = null
        }

        if (!this.parselets[type]) {
            this.parselets[type] = {
                prefixParse: null,
                infixPrecedence: null,
                infixParse: null
            }
        }

        var parselet = this.parselets[type]
        if (infixPrecedence !== null) {
            parselet.infixPrecedence = infixPrecedence
        }

        return parselet

    }

    consume(type) {
        if (this.context.peek().type === type) {
            this.context.next()
            return true
        }
        return false
    }

    peek() {
        return this.context.peek()
    }

    peekTokenPrecedence() {
        var token = this.context.peek()
        if (!token) {
            return Precedence.Lowest
        }

        console.log(token)

        var parselet = this.parselets[token.type]
        console.log(parselet)
        return (parselet && parselet.infixParse !== null ? parselet.infixPrecedence : Precedence.Lowest)
    }

    parse(precedence) {
        var token = this.context.peek()
        if (!token) {
            throw new Error('Missing Token')
        }

        var parselet = this.parselets[token.type]
        if (!parselet || !parselet.prefixParse) {
            throw new Error('Cannot parse if no expression is present')
        }



        console.log(token)
        console.log(parselet)
        this.context.next()
        var l = parselet.prefixParse(this, token)
        console.log(l)
        while (precedence < this.peekTokenPrecedence()) {
            token = this.context.next()
            var parselet_temp = this.parselets[token.type]
            if (!parselet_temp || !parselet_temp.infixParse) {
                throw new Error('Missing Infix Parse')
            }
            l = parselet_temp.infixParse(this, l, token)
        }
        return l
    }
}