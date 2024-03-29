import { Token, TEOF, TOP, TPLUS, TMINUS, TMUL, TDIV, TPOW, TMOD, TNUMBER, TSTRING, TLEFT_PAREN, TRIGHT_PAREN, TCOMMA, TNAME} from './token';
import {
    add,
    sub,
    mult,
    div,
    mod,
    sinh,
    cosh,
    tanh,
    asinh,
    acosh,
    atanh,
    log10,
    neg,
    not,
    trunc,
    random,
    factorial,
    gamma,
    stringOrArrayLength,
    hypot,
    roundTo,
    max,
    min,
    sign,
    cbrt,
    expm1,
    log1p,
    log2,
    sum
} from './functions';

export const unaryOps = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh || sinh,
    cosh: Math.cosh || cosh,
    tanh: Math.tanh || tanh,
    asinh: Math.asinh || asinh,
    acosh: Math.acosh || acosh,
    atanh: Math.atanh || atanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt || cbrt,
    log: Math.log,
    log2: Math.log2 || log2,
    ln: Math.log,
    lg: Math.log10 || log10,
    log10: Math.log10 || log10,
    expm1: Math.expm1 || expm1,
    log1p: Math.log1p || log1p,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    trunc: Math.trunc || trunc,
    '-': neg,
    '+': Number,
    exp: Math.exp,
    not: not,
    length: stringOrArrayLength,
    '!': factorial,
    sign: Math.sign || sign
}

export const binaryOps = {
    '+': add,
    '-': sub,
    '*': mult,
    '/': div,
    '%': mod,
    '^': Math.pow,
}

export const functions = {
    random: random,
    fac: factorial,
    min: min,
    max: max,
    hypot: Math.hypot || hypot,
    pyt: Math.hypot || hypot, // backward compat
    pow: Math.pow,
    atan2: Math.atan2,
    gamma: gamma,
    roundTo: roundTo,
    sum: sum
}

export const constants = {
    E: Math.E,
    PI: Math.PI,
    PHI: Math.PHI
}

var optionNameMap = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'remainder',
    '^': 'power',
    '!': 'factorial'
  };

export class TokenStream {
    constructor(expression) {
        this.pos = 0;
        this.current = null;
        this.unaryOps = unaryOps;
        this.binaryOps = binaryOps;
        this.consts = constants;
        this.expression = expression;
        this.savedPosition = 0;
        this.savedCurrent = null;
    }
    newToken(type, value, pos) {
        return new Token(type, value, pos != null ? pos : this.pos);
    }
    save() {
        this.savedPosition = this.pos;
        this.savedCurrent = this.current;
    }
    restore() {
        this.pos = this.savedPosition;
        this.current = this.savedCurrent;
    }
    next() {
        if (this.pos >= this.expression.length) {
            return this.newToken(TEOF, 'EOF');
        }

        if (this.isWhitespace() || this.isComment()) {
            return this.next();
        } else if (this.isRadixInteger() ||
            this.isNumber() ||
            this.isOperator() ||
            this.isString() ||
            this.isLeftParen() ||
            this.isRightParen() ||
            this.isComma() ||
            this.isNamedOp() ||
            this.isConst() ||
            this.isName()) {
            return this.current;
        } else {
            this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
        }
    }
    isString() {
        var r = false;
        var startPos = this.pos;
        var quote = this.expression.charAt(startPos);

        if (quote === '\'' || quote === '"') {
            var index = this.expression.indexOf(quote, startPos + 1);
            while (index >= 0 && this.pos < this.expression.length) {
                this.pos = index + 1;
                if (this.expression.charAt(index - 1) !== '\\') {
                    var rawString = this.expression.substring(startPos + 1, index);
                    this.current = this.newToken(TSTRING, this.unescape(rawString), startPos);
                    r = true;
                    break;
                }
                index = this.expression.indexOf(quote, index + 1);
            }
        }
        return r;
    }
    isLeftParen() {
        var c = this.expression.charAt(this.pos);
        if (c === '(') {
            this.current = this.newToken(TLEFT_PAREN, c);
            this.pos++;
            return true;
        }
        return false;
    }
    isRightParen() {
        var c = this.expression.charAt(this.pos);
        if (c === ')') {
            this.current = this.newToken(TRIGHT_PAREN, c);
            this.pos++;
            return true;
        }
        return false;
    }
    isComma() {
        var c = this.expression.charAt(this.pos);
        if (c === ',') {
            this.current = this.newToken(TCOMMA, ',');
            this.pos++;
            return true;
        }
        return false;
    }
    isConst() {
        var startPos = this.pos;
        var i = startPos;
        for (; i < this.expression.length; i++) {
            var c = this.expression.charAt(i);
            if (c.toUpperCase() === c.toLowerCase()) {
                if (i === this.pos || (c !== '_' && c !== '.' && (c < '0' || c > '9'))) {
                    break;
                }
            }
        }
        if (i > startPos) {
            var str = this.expression.substring(startPos, i);
            if (str in this.consts) {
                this.current = this.newToken(TNUMBER, this.consts[str]);
                this.pos += str.length;
                return true;
            }
        }
        return false;
    }
    isNamedOp() {
        var startPos = this.pos;
        var i = startPos;
        for (; i < this.expression.length; i++) {
            var c = this.expression.charAt(i);
            if (c.toUpperCase() === c.toLowerCase()) {
                if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
                    break;
                }
            }
        }
        if (i > startPos) {
            var str = this.expression.substring(startPos, i);
            if (this.isOperatorEnabled(str) && (str in unaryOps)) {
                this.current = this.newToken(TOP, str);
                this.pos += str.length;
                return true;
            }
        }
        return false;
    }
    isName() {
        var startPos = this.pos;
        var i = startPos;
        var hasLetter = false;
        for (; i < this.expression.length; i++) {
            var c = this.expression.charAt(i);
            if (c.toUpperCase() === c.toLowerCase()) {
                if (i === this.pos && (c === '$' || c === '_')) {
                    if (c === '_') {
                        hasLetter = true;
                    }
                    continue;
                } else if (i === this.pos || !hasLetter || (c !== '_' && (c < '0' || c > '9'))) {
                    break;
                }
            } else {
                hasLetter = true;
            }
        }
        if (hasLetter) {
            var str = this.expression.substring(startPos, i);
            this.current = this.newToken(TNAME, str);
            this.pos += str.length;
            return true;
        }
        return false;
    }
    isWhitespace() {
        var r = false;
        var c = this.expression.charAt(this.pos);
        while (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
            r = true;
            this.pos++;
            if (this.pos >= this.expression.length) {
                break;
            }
            c = this.expression.charAt(this.pos);
        }
        return r;
    }
    unescape(v) {
        var index = v.indexOf('\\');
        if (index < 0) {
            return v;
        }

        var buffer = v.substring(0, index);
        while (index >= 0) {
            var c = v.charAt(++index);
            switch (c) {
                case '\'':
                    buffer += '\'';
                    break;
                case '"':
                    buffer += '"';
                    break;
                case '\\':
                    buffer += '\\';
                    break;
                case '/':
                    buffer += '/';
                    break;
                case 'b':
                    buffer += '\b';
                    break;
                case 'f':
                    buffer += '\f';
                    break;
                case 'n':
                    buffer += '\n';
                    break;
                case 'r':
                    buffer += '\r';
                    break;
                case 't':
                    buffer += '\t';
                    break;
                case 'u':
                    // interpret the following 4 characters as the hex of the unicode code point
                    var codePoint = v.substring(index + 1, index + 5);
                    if (!codePointPattern.test(codePoint)) {
                        this.parseError('Illegal escape sequence: \\u' + codePoint);
                    }
                    buffer += String.fromCharCode(parseInt(codePoint, 16));
                    index += 4;
                    break;
                default:
                    throw this.parseError('Illegal escape sequence: "\\' + c + '"');
            }
            ++index;
            var backslash = v.indexOf('\\', index);
            buffer += v.substring(index, backslash < 0 ? v.length : backslash);
            index = backslash;
        }

        return buffer;
    }
    isComment() {
        var c = this.expression.charAt(this.pos);
        if (c === '/' && this.expression.charAt(this.pos + 1) === '*') {
            this.pos = this.expression.indexOf('*/', this.pos) + 2;
            if (this.pos === 1) {
                this.pos = this.expression.length;
            }
            return true;
        }
        return false;
    }
    isRadixInteger() {
        var pos = this.pos;

        if (pos >= this.expression.length - 2 || this.expression.charAt(pos) !== '0') {
            return false;
        }
        ++pos;

        var radix;
        var validDigit;
        if (this.expression.charAt(pos) === 'x') {
            radix = 16;
            validDigit = /^[0-9a-f]$/i;
            ++pos;
        } else if (this.expression.charAt(pos) === 'b') {
            radix = 2;
            validDigit = /^[01]$/i;
            ++pos;
        } else {
            return false;
        }

        var valid = false;
        var startPos = pos;

        while (pos < this.expression.length) {
            var c = this.expression.charAt(pos);
            if (validDigit.test(c)) {
                pos++;
                valid = true;
            } else {
                break;
            }
        }

        if (valid) {
            this.current = this.newToken(TNUMBER, parseInt(this.expression.substring(startPos, pos), radix));
            this.pos = pos;
        }
        return valid;
    }
    isNumber() {
        var valid = false;
        var pos = this.pos;
        var startPos = pos;
        var resetPos = pos;
        var foundDot = false;
        var foundDigits = false;
        var c;

        while (pos < this.expression.length) {
            c = this.expression.charAt(pos);
            if ((c >= '0' && c <= '9') || (!foundDot && c === '.')) {
                if (c === '.') {
                    foundDot = true;
                } else {
                    foundDigits = true;
                }
                pos++;
                valid = foundDigits;
            } else {
                break;
            }
        }

        if (valid) {
            resetPos = pos;
        }

        if (c === 'e' || c === 'E') {
            pos++;
            var acceptSign = true;
            var validExponent = false;
            while (pos < this.expression.length) {
                c = this.expression.charAt(pos);
                if (acceptSign && (c === '+' || c === '-')) {
                    acceptSign = false;
                } else if (c >= '0' && c <= '9') {
                    validExponent = true;
                    acceptSign = false;
                } else {
                    break;
                }
                pos++;
            }

            if (!validExponent) {
                pos = resetPos;
            }
        }

        if (valid) {
            this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
            this.pos = pos;
        } else {
            this.pos = resetPos;
        }
        return valid;
    }
    isOperator() {
        var startPos = this.pos;
        var c = this.expression.charAt(this.pos);

        if (c === '+') {
            this.current = this.newToken(TPLUS, c);
        } else if (c === '∙' || c === '•' || c === "*") {
            this.current = this.newToken(TMUL, c);
        } else if (c === '-') {
            this.current = this.newToken(TMINUS, c);
        } else if (c === '/') {
            this.current = this.newToken(TDIV, c);
        } else if (c === '^') {
            this.current = this.newToken(TPOW, c);
        } else if (c === '%') {
            this.current = this.newToken(TMOD, c);
        } else {
            return false;
        }
        this.pos++;

        if (this.isOperatorEnabled(this.current.value)) {
            return true;
        } else {
            this.pos = startPos;
            return false;
        }
    }
    isOperatorEnabled(op) {
        var opName = optionNameMap.hasOwnProperty(op) ? optionNameMap[op] : op
        var operators = {}
        return !(opName in operators) || !!operators[opName]
    }
    getCoordinates() {
        var line = 0;
        var column;
        var newline = -1;
        do {
            line++;
            column = this.pos - newline;
            newline = this.expression.indexOf('\n', newline + 1);
        } while (newline >= 0 && newline < this.pos);

        return {
            line: line,
            column: column
        };
    }
    parseError(msg) {
        var coords = this.getCoordinates();
        throw new Error('parse error [' + coords.line + ':' + coords.column + ']: ' + msg);
    }

    tokens() {
        var tokens = []
        var flag = true
        while (flag) {
            var next = this.next()
            if (next.type === 'TEOF') {
                flag = false
                break
            }
            tokens.push(next)
        }
        return tokens
    }
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  var codePointPattern = /^[0-9a-f]{4}$/i;
  
  
  
  
  
  
  
  
