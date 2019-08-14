import {
    Ea,
    epsilon,
} from './errores';
import {
    bolzano,
    T,
} from './utils';

/**
 * @function scores - Metodo de tanteos
 * [curryficado]
 *
 * @typedef {[number, number]} T
 *
 * @param {Function}    f   Función a analizar.
 * @param {number}      A   Cota inferior a tantear.
 * @param {number}      B   Cota superior a tantear.
 * @param {number}      inc Incremento.
 *
 * @returns Iterator<T>
 *
 * @example --
 */
export const scores =
    (f: any) =>
    (A: number) =>
    (B: number) =>
    function*(inc: number = 1) {
        const raizEn = bolzano(f);
        do {
            if (raizEn(A)(A + inc)) {
                yield [A, A + inc].sort((x, y) => x - y) as T;
                A += inc;
            }
            A += inc;
        } while (A < B);
    };

/**
 * @function tol - Tolerancia
 * [curryficado]
 *
 * @param {number} er   Error.
 * @param {number} a    Extremo a.
 * @param {number} b    Extremo b.
 *
 * @returns number
 */
const tol = (er: number) => (a: number) => (b: number) =>
    // tslint:disable-next-line:no-bitwise
    ~~(Math.log2((b - a) / er));
/**
 * @function medium - Intervalo Medio
 * [curryficado]
 *
 * @param {number} a    Extremo a.
 * @param {number} b    Extremo b.
 *
 * @returns number
 */
const medium = (a: number) => (b: number) =>
    (a + b) / 2;
/**
 * @function mediumInterval - Metodo de Intervalo Medio
 * [curryficado]
 *
 * @param {Function}    fn  Función a converger.
 * @param {number}      a   Extremo inferior de separación.
 * @param {number}      b   Extremo superior de separación.
 * @param {number}      err Cota superior de error.
 *
 * @returns Iterator<number>
 *
 * @example --
 */
export const mediumInterval =
    (fn: any) =>
    (a: number) =>
    (b: number) =>
    function*(err = epsilon()): Iterator<number> {
        let t = tol(err)(a)(b);
        const bl = bolzano(fn);
        let p;
        do {
            p = medium(a)(b);
            yield p;
            if (bl(a)(p)) {
                b = p;
            } else {
                a = p;
            }
        }while (--t);
    };

/**
 * @function interpolation - Formula de Interpolacion Lineal
 * [curryficado]
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 *
 * @returns number
 */
const interpolation = (x1: number) => (y1: number) => (x2: number) => (y2: number) =>
    (x1 * y2 - x2 * y1) / (y2 - y1);
/**
 * @function linearInterpolation - Metodo de Interpolación Lineal
 * [curryficado]
 *
 * @param {Function}    fn
 * @param {number}      x1
 * @param {number}      x2
 * @param {number}      err
 *
 * @returns Iterator<number>
 *
 * @example --
 */
export const linearInterpolation =
    (fn: any) =>
    (x1: number) =>
    (x2: number) =>
    function*(err = epsilon()) {
        const il = interpolation(x1)(fn(x1));
        let x;
        do {
            x = x2;
            x2 = il(x2)(fn(x2));
            yield x2;
        }while (Ea(x2)(x) < err);
    };

/**
 * @function newtonraphson - Modelo matematico de Newton-Rapson
 * [curryficado]
 *
 * @param {Function}    f   Función.
 * @param {Function}    df  Derivada primera de f.
 * @param {number}      xn  Punto de absisa.
 *
 * @returns number
 */
const newtonraphson = (f: any) => (df: any) => (xn: number) =>
    xn - (f(xn) / df(xn));
/**
 * @function newtonRaphson - Metodo de newton-rapson
 *
 * @param {Function}    f       Función a analizar.
 * @param {Function}    df1     Derivada primera de f.
 * @param {Function}    df2     Derivada segunda de f.
 * @param {number}      a       Extremo inferior de separación.
 * @param {number}      b       Extremo superior de separación.
 * @param {number}      err     Cota superior de Error.
 *
 * @returns Iterator<number>
 *
 * @example --
 */
export const newtonRaphson =
    (f: any) =>
    (df1: any) =>
    (df2: any) =>
    (a: number) => (b: number) =>
    function*(err = epsilon()) {
        const hayRaiz = bolzano(f);

        if (!hayRaiz(a)(b)) { throw Error('It lacks a root at the ends of separation.'); }

        if (!df2) { throw Error('The second derivative is "undefined".'); }

        let x0;
        if (f(a) * df2(a) > 0) {
            x0 = a;
        } else if (f(b) * df2(b) > 0) {
            x0 = b;
        } else { throw Error('The procedure is divergent at both ends of separation.'); }

        const nr = newtonraphson(f)(df1);
        do {
            a = x0; // reutilizacion de la variable a como variable auxiliar
            x0 = nr(x0);
            yield x0;
        }while (!(Ea(x0)(a) < err));
    };
