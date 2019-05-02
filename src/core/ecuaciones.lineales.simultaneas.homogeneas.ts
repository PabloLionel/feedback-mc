import {
    matrix,
    multiply,
    ones,
    size,
    inv,
    identity,
    trace,
    add,
} from 'mathjs';
import {
    scalar,
} from './utils';
/**
 * Faddeev Leverrier
 * @param A Matriz Homogena.
 */
export function* faddeevLeverrier(A: number[][]) {
    const n = A.length;
    const I = identity(n);
    let AK = A;
    const P = [1];
    for (let k = 1; k <= n; ++k) {
        const c = -1 * trace(AK) / k;
        P.push(c);
        AK = multiply(A, add(AK, scalar(I as number[][], c))) as number[][];
        yield AK;
    }
    const prod = Math.pow(-1, n);
    yield P.map((b: number) => b * prod);

}

/**
 * Metodo de las Potencias - Maximo Autovalor
 * @param A Matriz Homogena.
 */
export const potMax =
    (A: any[][]) =>
    (l = 1) =>
    (X0: number[][]) =>
    function*() {
        const M = matrix(A);
        if (!X0) { // generamos la columna de 1s
            X0 = ones([
                (size(M) as number[])[0],
                1,
            ]) as number[][];
        }
        let lam;
        let X1: number[];
        for (;;) {
            X1 = multiply(M, X0) as number[];
            lam = X1[0] * l;
            yield [lam, X1];
            X0 = multiply(X1, lam) as number[][];
        }
    };
/**
 * Metodo de las Potencias - Minimo Autovalor
 * @param A Matriz Homogena.
 * @param l valor lambda inicial, por defecto es 1.
 * @param X0 Matriz solución inicial, por defecto es [[1], [1], [1], ...].
 */
export const potMin =
    (A: number[][]) =>
    (l = 1) =>
    (X0: number[][]) =>
    function*() {
        const Minv = inv(matrix(A));
        if (!X0) { // generamos la columna de 1s
            X0 = ones([
                (size(Minv) as number[])[0],
                1,
            ]) as number[][];
        }
        let lam;
        let X1: number[];
        for (;;) {
            X1 = multiply(Minv, X0) as number[];
            lam = X1[0] * l;
            yield [lam, X1];
            X0 = multiply(X1, 1 / lam) as number[][];
        }
    };
