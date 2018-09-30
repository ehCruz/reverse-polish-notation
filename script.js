//(2+5*2)-(3+5)*7+(8/4)+1
var btnCalcular = document.getElementById('btnCalcular');
var txtExpressao = document.getElementById('expressao');
var regex = /[a-zA-Z0]|^$|\d{2,}|[\\^\*\+/-][\^\*\+/-]|[)][(]/;
var output = [];
var operadores = [];

var validaExpressao = function (expressao) {
    var isValid = expressao.search(regex);
    isValid === -1 ? btnCalcular.disabled = false : btnCalcular.disabled = true;
}

var separarElementos = function (expressao) {
    output = [];
    expressao = replaceAll(expressao, ' ', '');
    var regex = new RegExp('[\\^\\*\\+/-]|[(]|[)]');
    var isOperator;
    for (let i = 0; i < expressao.length; i++) {
        isOperator = regex.test(expressao.charAt(i));
        isOperator ? verificaPilha(expressao.charAt(i)) : output.push(expressao.charAt(i));
    }
    while (operadores.length > 0) {
        output.push(operadores.pop());
    }
    calcularExpressao();
}

/**
 * 
 * @param {String} expressao 
 * @param {String} find 
 * @param {String} replace
 * Recebe uma String, procura e subtitui os caracteres passados como parêmtros 
 */
var replaceAll = function (expressao, find, replace) {
    return expressao.replace(new RegExp(find, 'g'), replace);
}

var verificaPilha = function (el) {
    if (el === '+' || el === '-') {
        if (operadores.lastIndexOf('-') >= 0 || operadores.lastIndexOf('+') >= 0
            || operadores.lastIndexOf('*') >= 0 || operadores.lastIndexOf('/') >= 0 || operadores.lastIndexOf('*') >= 0) {
            while ((operadores[operadores.length - 1] === '-' || operadores[operadores.length - 1] === '+'
                || operadores[operadores.length - 1] === '*' || operadores[operadores.length - 1] === '/' || operadores[operadores.length - 1] === '^')
                && (operadores[operadores.length - 1] !== '(')) {
                output.push(operadores.pop());
            }
        }
        operadores.push(el);
    } else if (el === '*' || el === '/') {
        if (operadores.lastIndexOf('*') >= 0 || operadores.lastIndexOf('/') >= 0 || operadores.lastIndexOf('^') >= 0) {
            while ((operadores[operadores.length - 1] === '*' || operadores[operadores.length - 1] === '/' || operadores[operadores.length - 1] === '^')
                && (operadores[operadores.length - 1] !== '(')) {
                output.push(operadores.pop());
            }
        }
        operadores.push(el);
    } else if (el === '^') {
        if (operadores.lastIndexOf('^') >= 0) {
            while (operadores[operadores.length - 1] === '^' && (operadores[operadores.length - 1] !== '(')) {
                output.push(operadores.pop());
            }
        }
        operadores.push(el);
    } else if (el === ')') {
        while (operadores[operadores.length - 1] !== '(') {
            output.push(operadores.pop());
        }
        operadores.pop();
    } else {
        operadores.push(el);
    }
}

var calcularExpressao = function () {
    var aux = [];
    var resultado = 0;
    var exp = '';
    output.forEach(el => {
        resultado = 0;
        switch (el) {
            case '+':
                resultado = aux.pop() + aux.pop();
                aux.push(resultado);
                break;
            case '-':
                var sub2 = aux.pop();
                var sub1 = aux.pop();
                resultado = sub1 - sub2;
                console.log(resultado);
                aux.push(resultado);
                break;
            case '*':
                resultado = aux.pop() * aux.pop();
                aux.push(resultado);
                break;
            case '/':
                var divisor = aux.pop();
                var dividendo = aux.pop();
                resultado = dividendo / divisor;
                aux.push(resultado);
                break;
            case '^':
                resultado = aux.pop() ^ aux.pop();
                aux.push(resultado);
                break;
            default:
                aux.push(parseInt(el));
                break;
        }
        exp += ' ' + el;
    });
    exibirResultado(exp, aux.pop());
}

var exibirResultado = function(expressao, resultado) {
    var el = document.getElementById('calc');
    var result = '<h2 class="result"> Postfix: ' + expressao + '</h2>';
    result += '<h2>Resultado: ' + resultado + '</h2>';
    result += '<button id="clearAll"> Limpar </button>';
    el.innerHTML = result;

    var btnClearAll = document.getElementById('clearAll');
    btnClearAll.addEventListener('click', function(){
        txtExpressao.value = '';
        txtExpressao.disabled = false;
        txtExpressao.focus();
        el.innerHTML = '';
    });
}

txtExpressao.addEventListener('keyup', function () {
    validaExpressao(txtExpressao.value);
});

btnCalcular.addEventListener('click', function () {
    this.disabled = true;
    txtExpressao.disabled = true
    separarElementos(txtExpressao.value);
});