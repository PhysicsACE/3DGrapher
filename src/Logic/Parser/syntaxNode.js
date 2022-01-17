const nodeType = {
    None: 0,
    Call: 1,
    Identifier: 2,
    Literal: 3,
    Group: 4,
    Prefix: 5,
    Infix: 6,
    Postfix: 7,
    Vector: 8
}

export class SyntaxNode {
    constructor(type) {
        this.type = type ? type : nodeType.None
        this.children = []
        this.parent = null
        this.token = null
    }

    setToken(token) {
        this.token = token
    }

    setChildren(children) {
        this.children = children
    }

    childAtId(idx) {
        return this.children[idx]
    }

    isCall() {
        return this.type === nodeType.Call
    }

    isGroup() {
        return this.type === 4
    }

    isLeaf() {
        return this.children.length === 0
    }

    isCallIdentifier() {
        return (this.parent && this.parent.isCall() && this.parent.firstChild() === this)
    }

    isCallName(name) {
        return (this.isCall() && this.functionName === name)
    }

    functionName() {
        return (this.isCall() ? this.firstChild().tokenVal() : null)
    }

    tokenVal() {
        return (this.token ? this.token.value : null)
    }

    tokenType() {
        return (this.token ? this.token.type : 'TEOF')
    }

    floatVal() {
        var value = this.token.value
        var floatval
        try {
            floatval = parseFloat(value)
        } catch (e) {
            floatval = null
        }

        return floatval
    }

    firstChild() {
        return this.children[0]
    }
    
    secondChild() {
        return this.children[1]
    }

    emit(s) {
        if (this.type === nodeType.None) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].emit(s)
                if (i !== this.children.length - 1) {
                    s.push('\n')
                }
            }
        } else if (this.type === nodeType.Call) {
            var name = this.functionName()
            s.push(name + '(')
            if (this.children.length === 1) {
                throw new Error("Missing argument to function" + name)
            }
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].emit(s)
                if (i !== this.children.length - 1) {
                    s.push(', ')
                }
            }
            s.push(')')
        } else if (this.type === nodeType.Identifier || this.type === nodeType.Literal) {
            s.push(this.tokenVal())
        } else if (this.type === nodeType.Group) {
            s.push('(')
            this.firstChild().emit(s)
            s.push(')')
        } else if (this.type === nodeType.Prefix) {
            s.push(this.tokenVal() + " ")
            this.firstChild().emit(s)
        } else if (this.type === nodeType.Infix) {
            this.firstChild().emit(s)
            s.push(" " + this.tokenVal() + " ")
            this.secondChild().emit(s)
        } else if (this.type === nodeType.Postfix) {
            this.firstChild().emit(s)
            s.push(this.tokenVal())
        }
    }

    
}