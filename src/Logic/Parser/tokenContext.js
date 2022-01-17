import { TEOF } from "./token"

export class TokenContext {
    constructor(tokens) {
        this.tokens = tokens
        this.idx = 0
        this.isDone = false
    }

    peek() {
        if (!this.isDone) {
            var token = this.tokens[this.idx]
            if (token.type !== 'TEOF') {
                return {type: token.type, value: token.value}
            }
            return {type: TEOF, value: null}
        }
    }

    next() {
        var token = this.peek()
        this.idx++
        if (this.idx === this.tokens.length) {
            this.isDone = true
        }
        return token
    }

    hasRemaining() {
        return (!this.isDone)
    }

    advanceToNext(type) {
        while (this.peek().type !== type && this.peek.type !== 'TEOF') {
            this.next()
        }
        return this.peek().type !== 'TEOF'
    }

    consumeType(type) {
        if (this.peek().type === type) {
            return this.next()
        }
        return null
    }

    cosumeConditional(rule) {
        var token = this.peek()
        if (rule(token)) {
            this.idx++
            if (this.idx === this.tokens.length) {
                this.isDone = true
            }
            return token
        }
        return null
    }
}