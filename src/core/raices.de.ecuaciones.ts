import { Ea, epsilon } from './errores';
import { bolzano } from './utils';

/**
 * Metodo de tanteos
 * @param {*} x1
 */
export const scores =
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
const medium = (a: number) => (b: number) =>
    (a + b) / 2;
/**
 * Metodo de Intervalo Medio
 * @param {*} x1
 */
export const mediumInterval =
    (fn: any) =>
    (a: number) =>
    (b: number) =>
    function*(err = epsilon()) {
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
 * Formula de Interpolacion Lineal
 * @param {*} x1
 */
const interpolation = (x1: number) => (y1: number) => (x2: number) => (y2: number) =>
    (x1 * y2 - x2 * y1) / (y2 - y1);
/**
 * Metodo de Interpolación Lineal
 * @param {*} x1
 */
export const linearInterpolation =
    (f: any) =>
    (x1: number) =>
    (x2: number) =>
    function*(err = epsilon()) {
        const il = interpolation(x1)(f(x1));
        let x;
        do {
            x = x2;
            x2 = il(x2)(f(x2));
            yield x2;
        }while (Ea(x2)(x) < err);
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
    function*(err = epsilon()) {
        const hayRaiz = bolzano(f);
        let x0;
        if (!hayRaiz(a)(b)) {
            throw Error('Se carece de una raiz en los extremos de separacion.');
        }

        if (f(a) * df2(a) > 0) {
            x0 = a;
        } else if (f(b) * df2(b) > 0) {
            x0 = b;
        } else {
            throw Error('El procedimiento es divergente en ambos extremos de separacion.');
        }

        const nr = newtonraphson(f)(df1);
        do {
            a = x0; // reutilizacion de la variable a como variable auxiliar
            x0 = nr(x0);
            yield x0;
        }while (!(Ea(x0)(a) < err));
    };
