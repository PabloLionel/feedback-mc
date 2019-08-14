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
 * @function faddeevLeverrier - Faddeev Leverrier
 * Recibe una matriz homogena va devolviendo en un
 * iterable las matrices B(2), B(3), ..., B(n).
 * Cuando ya se completo calculo de las matrices B,
 * calcula y devuelve los valores de "lambda" afectado
 * por el producto de (-1)^n:
 * [λ(1), λ(2), λ(3), ..., λ(n)]
 * que conforman el polinomio de faddeev:
 * λ(n)x^n + ... + λ(3)x^2 + λ(2)x + λ(1)
 *
 * @param {number[][]} A : Matriz Homogena NxN(cuadrada).
 *
 * @returns Iterator<number[] | number[][]>
 *
 * @example
 * results = potMax([
 *  [6, 5, -5],
 *  [2, 6, -2],
 *  [2, 5, -1]
 * ])()([[-1, 1, 1]]); // el lambda por defecto.
 * let i = 10 // calculamos 10 valores.
 * for (let result of results) {
 *  console.log(result)
 *  if (!i) break
 * }
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
    const prod = (-1) ** n; // (-1)^n
    const lambdaRoots = P.map((b: number) => b * prod);

    yield lambdaRoots;
}

/**
 * @function potMax - Metodo de las Potencias (Maximo Autovalor)
 * [curryficada]
 * Obtiene un iterador con los valores [lambda(n), vector X(n)],
 * donde lambda(n) es el valor de lambda calculado del vector X(n)
 * hallado, por defecto en la primer iteración lambda = 1 y X0 esta
 * conformado de unos.
 *
 * @param {number[][]}  A: Matriz Homogena NxN(cuadrada).
 * @param {number}      lambda: valor por defecto de lambda.
 * @param {number[][]}  X0: Matriz solución inicial,
 * por defecto es:  [
 *                      [1],
 *                      [1],
 *                      ...,
 *                      [1]
 *                  ]
 * de dimension Nx1.
 *
 * @returns Iterator<[number, number[][]]>
 *
 * @example
 * results = potMax([
 *  [6, 5, -5],
 *  [2, 6, -2],
 *  [2, 5, -1]
 * ])()([[-1], [1], [1]]); // el lambda por defecto.
 * let i = 10 // calculamos 10 valores.
 * for (let result of results) {
 *  console.log(result)
 *  if (!i) break
 * }
 */
export const potMax =
    (A: number[][]) =>
    (lambda = 1) =>
    (X0?: number[][]) =>
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
            lam = X1[0] * lambda;
            yield [lam, X1];
            X0 = multiply(X1, lam) as number[][];
        }
    };
/**
 * @function potMin - Metodo de las Potencias (Minimo Autovalor)
 * [curryficada]
 * Obtiene un iterador con los valores [lambda(n), vector X(n)],
 * donde lambda(n) es el valor de lambda calculado del vector X(n)
 * hallado, por defecto en la primer iteración lambda = 1 y X0 esta
 * conformado de unos.
 *
 * @param {number[][]}  A: Matriz Homogena NxN(cuadrada).
 * @param {number}      lambda: valor por defecto de lambda.
 * @param {number[][]}  X0: Matriz solución inicial,
 * por defecto es:  [
 *                      [1],
 *                      [1],
 *                      ...,
 *                      [1]
 *                  ]
 * de dimension Nx1.
 *
 * @returns Iterator<[number, number[][]]>
 *
 * @example
 * results = potMax([
 *  [6, 5, -5],
 *  [2, 6, -2],
 *  [2, 5, -1]
 * ])()([[-1], [1], [1]]); // el lambda por defecto.
 * let i = 10 // calculamos 10 valores.
 * for (let result of results) {
 *  console.log(result)
 *  if (!i) break
 * }
 */
export const potMin =
    (A: number[][]) =>
    (lambda = 1) =>
    (X0?: number[][]) =>
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
            lam = X1[0] * lambda;
            yield [lam, X1];
            X0 = multiply(X1, 1 / lam) as number[][];
        }
    };
