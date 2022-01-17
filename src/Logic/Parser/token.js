export var TEOF = 'TEOF'
export var TOP = 'TOP'
export var TPLUS = 'PLUS'
export var TMINUS = 'MINUS'
export var TMUL = 'MUL'
export var TDIV = 'DIV'
export var TPOW = 'POW'
export var TMOD = 'MOD'
export var TNUMBER = 'NUMBER'
export var TSTRING = 'STRING'
export var TLEFT_PAREN = 'LEFT_PAREN'
export var TRIGHT_PAREN = 'RIGHT_PAREN'
export var TCOMMA = 'COMMA'
export var TNAME = 'NAME'



export class Token {
    constructor(type, value, idx) {
        this.type = type
        this.value = value
        this.idx = idx
    }
}

Token.prototype.toString = function () {
    return this.type + ' ' + this.value
}