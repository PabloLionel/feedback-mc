import { conf } from './index';
import {
    copyMatrix,
    pivote,
    zeros,
    eye,
    multiply,
} from './utils';
import { epsilon } from './errores';

/**
 * @function gaussianElimination - Eliminacion Gaussiana
 *  Calcula la solucion de un sistema de ecuaciones aplicando
 * el metodo de "Eliminación Gaussiana".
 *
 * @param {number[][]} A Matriz apliada.
 *
 * @returns Iterator<number[] | number[][]>
 *
 * @example
 * const results = gaussianElimination([
 *     [2,6,1,7],
 *     [1,2,-1,-1],
 *     [5,7,-4,9],
 * ])
 * for (let r of results) {
 *   console.log(r)
 * }
 */
export const gaussianElimination = function*(A: number[][]) {
    if (!A) { throw new Error(`A matrix was expected.`); }
    if (!A[0]) { throw new Error(`Null matrix.`); }
    const G = copyMatrix(A);
    let n = A.length;
    let m = A[0].length;
    let k;
    let i;
    let j;
    // escalonado de la matriz:
    for (k = 0; k < n - 1; ++k) {
        if (G[k][k] === 0) { throw new Error(`Null pivot in row and column ${k}-${k}.`); }
        for (i = k + 1; i < n; ++i) {
            const ep = pivote(G[k][k])(G[i][k]);
            for (j = k + 1; j < m; ++j) {
                G[i][j] = ep(G[k][j])(G[i][j]);
            }
            G[i][k] = 0;
        }
    }
    yield G;
    // Sustitución inversa:
    const X = zeros([n]);
    n--;
    m--;
    for (i = n; i > -1; --i) {
        let s = 0;
        for (j = i; j < n; ++j) {
            s += G[i][j + 1] * X[j + 1];
        }
        X[i] = (G[i][m] - s) / G[i][i];
    }
    yield X;
};

/**
 * @function gaussJordan - Gauss Jordan
 *  Calcula la solucion de un sistema de ecuaciones aplicando
 * el metodo de "Gauss Jordan".
 *  Retorna un objeto iterable que devuleve las reducciones
 * de la matriz hasta converger a la solucción.
 *
 * @param {number[][]} A Matriz apliada.
 *
 * @returns Iterator<number[] | number[][]>
 *
 * @example
 * const results = gaussJordan([
 *     [2,6,1,7],
 *     [1,2,-1,-1],
 *     [5,7,-4,9],
 * ])
 * for (let r of results) {
 *   console.log(r)
 * }
 */
export const gaussJordan = function*(A: number[][]) {
    const n = A.length;
    const m = A[0].length;
    let J = copyMatrix(A);
    let i;
    let j;
    let k;
    let b;
    for (k = 0; k < n; ++k) {
        b = zeros([n, n - k]);
        if (J[0][0] === 0) { throw new Error(`Null pivot in row and column ${k}-${k}.`); }
        for (i = 1; i < n; ++i) {
            const pv = pivote(J[0][0])(J[i][0]);
            for (j = 1; j < m - k; ++j) {
                b[i - 1][j - 1] = pv(J[0][j])(J[i][j]);
            }
        }
        for (j = 1; j < m - k; ++j) {
            b[n - 1][j - 1] = J[0][j] / J[0][0];
        }
        J = b;
        yield b;
    }
    yield J.map(([x]) => x);
};

/**
 * @function gaussSeidel - Gauss Seidel
 *  Buscamos la solución a un sistema de ecuaciones lineales.
 *  Es un método iterativo, lo que significa que se parte
 * de una aproximación inicial y se repite el proceso hasta
 * llegar a una solución con un margen de error tan pequeño
 * como se quiera.
 *
 * @param {number[][]}  A       Matriz apliada.
 * @param {number[][]}  solini  Solución inicial.
 * @param {number}      err     Cota superior de error.
 *
 * @returns Iterator<number[]>
 *
 * @example
 * const results = gaussSeidel([
 *     [2, 6,  1,  7],
 *     [1, 2, -1, -1],
 *     [5, 7, -4,  9],
 * ])()()
 * for (let r of results) {
 *     console.log(r)
 * }
 */
export const gaussSeidel =
    (A: number[][]) =>
    (solini: number[][] = [[0]]) =>
    function*(err: number = epsilon()) {
        const config = conf();
        const n = A.length;
        // compruebe si la matriz A es diagonalmente dominante.
        for (let i = 0; i < n; ++i) {
            let s = 0;
            [...A[i].slice(0, i), ...A[i].slice(i + 1)]
                .forEach((a: number) => {
                    s += Math.abs(a);
                });
            if (Math.abs(A[i][i]) < s) {
                // tslint:disable-next-line:no-console
                console.warn('It is possible that the solution diverges.');
                break;
            }
        }
        if (solini[0].length === 1) {
            solini[0] = zeros([n]);
        }
        const S = copyMatrix(A);
        const errEval = (new Array(n)).fill(1);
        while (config.maxiter--) {
            const x = zeros([n]);
            for (let i = 0; i < n; ++i) {
                let s = 0;
                [...S[i].slice(0, i), ...S[i].slice(i + 1)]
                    .forEach((a: number, j: number) => {
                        s += a * solini[solini.length - 1][j];
                    });
                x[i] = (S[i][S[i].length - 1] - s) / S[i][i];
                errEval[i] = Math.abs(x[i] - solini[solini.length - 1][i]);
            }
            solini.push(x);
            yield x;
            if (Math.min(...errEval) < err) {
                break;
            }
        }
    };

/**
 * @function LUfactorization - Factorizacion LU
 *
 * @param {number[][]} A Matriz ampliada.
 *
 * @returns number[]
 */
export const LUfactorization = (A: number[][]) => {
    let n = A.length;
    const U = copyMatrix(A);
    const L = zeros([n, n]);
    let i;
    let j;
    let k;
    // escalonar las  matrices L y U
    for (k = 0; k < n - 1; ++k) {
        if (U[k][k] === 0) { throw new Error(`Null pivot in row and column ${k}-${k}.`); }
        for (i = k + 1; i < n; ++i) {
            L[i][k] = U[i][k] / U[k][k];
        }
        // L[k][k] = 1 no necesario para el calcular Y-subi
        for (i = k + 1; i < n; ++i) {
            // seleccion del pivot.
            const pv = pivote(U[k][k])(U[i][k]);
            // no trabajamos sobre los terminos independientes,
            for (j = k + 1; j < n; ++j) {
                // los reutilizamos en el calculo de la matriz Y-subi.
                // ascalonando de la matriz.
                U[i][j] = pv(U[k][j])(U[i][j]);
            }
            U[i][k] = 0;
        }
    }
    // L[n-1][n-1] = 1 no necesario para el calcular Y-subi
    // calculo de la matris Y-subi (L * y = b)
    // yi = [0] * n, reutilizamos los terminos independientes de U como si fuese la matriz de incognitas Y-subi.
    for (i = 0; i < n; ++i) {
        let s = 0;
        for (j = 0; j < i; ++j) {
            s += L[i][j] * U[j][U[j].length - 1];
        }
        U[i][U[i].length - 1] = U[i][U[i].length - 1] - s;
    }
    // calculo de las incognitas (U * x = y)
    const x = zeros([n]);
    n--;
    for (i = n; i > -1; --i) {
        let s = 0;
        for (j = i; j < n; ++j) {
            s += U[i][j + 1] * x[j + 1];
        }
        x[i] = (U[i][U[i].length - 1] - s) / U[i][i];
    }
    return x;
};

/**
 * @function matInv - Método de la Matriz Inversa
 *
 * @param {number[][]} A Matriz apliada.
 *
 * @returns Iterator<number[] | number[][]>
 *
 * @example
 * const results = gaussianElimination([
 *     [2,6,1,7],
 *     [1,2,-1,-1],
 *     [5,7,-4,9],
 * ])
 * for (let r of results) {
 *   console.log(r)
 * }
 *
 */
export function* matInv(M: number[][]) {
    const C = M.map((fila: number[]) => [fila.pop()]);
    const n = M.length;
    const m = n * 2;
    const D = [];
    const I = eye(n);
    let i;
    let j;
    let k;
    for (i = 0; i < n; ++i) {
        D.push(M[i].concat(I[i]));
    }
    let J = copyMatrix(D);
    for (k = 0; k < n; ++k) {
        const b = zeros([n, n - k]);
        if (J[0][0] === 0) { throw new Error(`Null pivot in row and column ${k}-${k}.`); }
        for (i = 1; i < n; ++i) {
            const pv = pivote(J[0][0])(J[i][0]);
            for (j = 1; j < m - k; ++j) {
                b[i - 1][j - 1] = pv(J[0][j])(J[i][j]);
            }
        }
        for (j = 1; j < m - k; ++j) {
            b[n - 1][j - 1] = J[0][j] / J[0][0];
        }
        J = b;
        yield J;
    }
    yield multiply(J, C as number[][]).map(([x]) => x);
}
