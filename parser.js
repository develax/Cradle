const cr = require("./cradle");

function factor() {
    if (_look === '('){
        cr.match('(');
        expression();
        cr.match(')');
    }
    else{
        cr.emitLn('MOVE #' + cr.getNum() + ',D0');
    }
}

function term(){
    factor();
    while (['*', '/'].includes(_look)) {
        cr.emitLn('MOVE D0,-(SP)');
        switch (_look) {
            case '*':
                multiply();
                break;
            case '/':
                divide();
                break;
            default:
                cr.expected('* or /');
                break;
        }
    }
}

function multiply() {
    cr.match('*');
    factor();
    cr.emitLn('MULS (SP)+,D0');
}

function divide(){
    cr.match('/');
    factor();
    cr.emitLn('MOVE (SP)+,D1');
    cr.emitLn('DIVS D1,D0');
}

function expression() {
    term();

    while (['+', '-'].includes(_look)) {
        cr.emitLn('MOVE D0,-(SP)');
        switch (_look) {
            case '+':
                add();
                break;
            case '-':
                subtract();
                break;
            default:
                cr.expected('+ or -');
                break;
        }
    }
}

function add() {
    cr.match('+');
    term();
    cr.emitLn('ADD (SP)+,D0')
}

function subtract() {
    cr.match('-');
    term();
    cr.emitLn('SUB (SP)+,D0')
    cr.emitLn('NEG D0')
}

cr.init('1-(2+3)*5');
expression();

// https://www.asm80.com/