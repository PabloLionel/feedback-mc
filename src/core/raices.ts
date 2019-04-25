import { Ea } from './error';
// import 'Function';
const conf = () => ({
    maxiter: 30,
});

/**
 * Interpretación geometrica del teorema de Bolzano
 * @param {*} x1
 */
const bolzano = (f: any) => (a: number) => (b: number) =>
    f(a) * f(b) < 0;

/**
 * Metodo de tanteos
 * @param {*} x1
 */
export const tanteos =
    (f: any) =>
    (A: number) =>
    (B: number) =>
    function*(inc: number) {
        const raizEn = bolzano(f);
        do {
            if (raizEn(A)(A + inc)) {
                yield [A, A + inc].sort((x, y) => x - y);
                A += inc;
            }
            A += inc;
        } while (A < B);
    };

/**
 * Tolerancia
 * @param {*} x1
 */
const tol = (er: number) => (a: number) => (b: number) =>
    // tslint:disable-next-line:no-bitwise
    ~~(Math.log2((b - a) / er));
/**
 * Intervalo Medio
 * @param {*} x1
 */
const medio = (a: number) => (b: number) =>
    (a + b) / 2;
/**
 * Metodo de Intervalo Medio
 * @param {*} x1
 */
export const intervaloMedio =
    (fn: any) =>
    (a: number) =>
    (b: number) =>
    function*(err = 0.0001) {
        let t = tol(err)(a)(b);
        const bl = bolzano(fn);
        let p;
        do {
            p = medio(a)(b);
            yield p;
            if (bl(a)(p)) {
                b = p;
            } else {
                a = p;
            }
        }while (--t);
    };

/**
 * Formula de Interpolacion Lineal
 * @param {*} x1
 */
const interpolacion = (x1: number) => (y1: number) => (x2: number) => (y2: number) =>
    (x1 * y2 - x2 * y1) / (y2 - y1);
/**
 * Metodo de Interpolación Lineal
 * @param {*} x1
 */
export const interpolacionLineal =
    (f: any) =>
    (x1: number) =>
    (x2: number) =>
    function*(err = 0.0001) {
        const il = interpolacion(x1)(f(x1));
        let x;
        do {
            x = x2;
            x2 = il(x2)(f(x2));
            yield x2;
        }while (Ea(x2)(x) < err);
    };

/**
 * Aceleracion de Aitken
 * @param {*} x1
 */
const aitken = (x1: number) => (x2: number) => (x3: number) =>
    x3 - Math.pow(x3 - x2, 2) / (x3 - 2 * x2 + x3);

/**
 * Metodo de Iteracion
 * @param {*} x1
 */
export const iteracion =
    (g: any) =>
    (x0: number) =>
    (ak = false) =>
    function*(err = 0.0001) {
        const CONF = conf();
        if (ak) {
            const x = [x0];
            let x1;
            while (--CONF.maxiter) {
                x1 = x.length % 3 ?
                g(x[x.length - 1])
                : aitken(x[x.length - 3])(x[x.length - 2])(x[x.length - 1]);
                yield x1;
                x.push(x1);
                if (Ea(x[x.length - 2])(x[x.length - 1]) < err) { break; }
            }
        } else {
            let x;
            while (--CONF.maxiter) {
                x = x0;
                x0 = g(x0);
                yield x0;
                if (Ea(x0)(x) < err) { break; }
            }
        }
    };

/**
 * Modelo matematico de Newton-Rapson
 * @param {*} x1
 */
const newtonraphson = (f: any) => (df: any) => (xn: number) =>
    xn - (f(xn) / df(xn));
/**
 * Metodo de newton-rapson
 * @param {*} x1
 */
export const newtonRaphson = 
    (f: any) => // funcion a hallar su raiz
    (df1: any) => // derivada primera de la funcion
    (df2: any) => // derivada segunda de la funcion
    (a: number) => (b: number) =>  // extremos de separacion
    function*(err = 0.0001) {
        const hayRaiz = bolzano(f);
        let x0;
        if (!hayRaiz(a)(b)) { throw Error('Se carece de una raiz en los extremos de separacion.'); }

        if (f(a) * df2(a) > 0) {
            x0 = a;
        } else if (f(b) * df2(b) > 0) {
            x0 = b;
        } else { throw Error('El procedimiento es divergente en ambos extremos de separacion.'); }

        const nr = newtonraphson(f)(df1);
        do {
            a = x0; // reutilizacion de la variable a como variable auxiliar
            x0 = nr(x0);
            yield x0;
        }while (!(Ea(x0)(a) < err));
    };

/**
 * Modelo matematico del Segundo Ornde de Newton-Rapson
 * @param {*} x1
 */
const segundoOrdenNR = (f: any) => (df1: any) => (df2: any) => (xn: number) =>
    xn - ( f(xn)
        / (df1(xn) - (f(xn) * df2(xn))
        / (2 * df1(xn))
        )
    );
export const segundoOrdenNewtonRaphson =
    (f: any) => // funcion a hallar su raiz
    (df1: any) => // derivada primera de la funcion
    (df2: any) => // derivada segunda de la funcion
    (a: number) => (b: number) => // extremos de separacion
    function*(err = 0.0001) {
        const hayRaiz = bolzano(f);
        let x0;
        if (!hayRaiz(a)(b)) { throw Error('Se carece de una raiz en los extremos de separacion.'); }
        if (f(a) * df2(a) > 0) {
            x0 = a;
        } else if (f(b) * df2(b) > 0) {
            x0 = b;
        } else { throw Error('El procedimiento es divergente en ambos extremos de separacion.'); }
        const sonr = segundoOrdenNR(f)(df1)(df2);
        do {
            a = x0; // reutilizacion de la variable a como variable auxiliar
            x0 = sonr(x0);
            yield x0;
        }while (!(Ea(x0)(a) < err));
    };
