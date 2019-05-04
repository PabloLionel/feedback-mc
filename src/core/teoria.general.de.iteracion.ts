import { Ea, epsilon } from './errores';
import { conf } from './index';
import { bolzano } from './utils';

/**
 * Aceleracion de Aitken
 * @param {*} x1
 */
const aitken = (x1: number) => (x2: number) => (x3: number) =>
    x3 - Math.pow(x3 - x2, 2) / (x3 - 2 * x2 + x1);

/**
 * Metodo de Iteracion
 * @param {*} x1
 */
export const iteracion =
    (g: any) =>
    (x0: number) =>
    (ak = false) =>
    function*(err = epsilon()) {
        const CONF = conf();
        if (ak) {
            const x = [x0];
            let x1;
            while (--CONF.maxiter) {
                x1 = x.length % 3 ? // si aun no calculamos 3 valores
                    g(x[x.length - 1]) // aplicamos la función de iteración
                    : aitken(x[x.length - 3])(x[x.length - 2])(x[x.length - 1]); // sino aplicamos Aitken.
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

        const sonr = segundoOrdenNR(f)(df1)(df2);
        do {
            a = x0; // reutilizacion de la variable a como variable auxiliar
            x0 = sonr(x0);
            yield x0;
        }while (!(Ea(x0)(a) < err));
    };

// export const sturm
