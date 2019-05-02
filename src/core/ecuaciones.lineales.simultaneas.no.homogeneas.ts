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
 * Eliminacion Gaussiana
 * @param A
 */
export const eliminacionGaussiana = (A: number[][]) => {
    const G = copyMatrix(A);
    let n = A.length;
    let m = A[0].length;
    let i;
    let j;
    let k;
    for (k = 0; k < n - 1; ++k) { // escalonado de la matriz
        if (G[k][k] === 0) {
            throw new Error(`Pivote nulo en fila y columna ${k}.`);
        }
        for (i = k + 1; i < n; ++i) {
            const ep = pivote(G[k][k])(G[i][k]);
            for (j = k + 1; j < m; ++j) {
                G[i][j] = ep(G[k][j])(G[i][j]);
            }
            G[i][k] = 0;
        }
    }
    // Sustitución inversa
    const x = (new Array(n)).fill(0);
    n--;
    m--;
    for (i = n; i > -1; --i) {
        let s = 0;
        for (j = i; j < n; ++j) {
            s += G[i][j + 1] * x[j + 1];
        }
        x[i] = (G[i][m] - s) / G[i][i];
    }
    return x;
};

/**
 * Gauss Jordan
 * @param A
 */
export const gaussJordan = (A: number[][]) => {
    const n = A.length;
    const m = A[0].length;
    let J = copyMatrix(A);
    let i;
    let j;
    let k;
    let b;
    for (k = 0; k < n; ++k) {
        b = zeros([n, n - k]);
        if (J[0][0] === 0) {
            throw new Error(`Pivote nulo en ${k} fila`);
        }
        for (j = 0; j < m - k; ++j) {
            b[n - 1][j - 1] = J[0][j] / J[0][0];
        }
        for (i = 1; i < n; ++i) {
            const ep = pivote(J[0][0])(J[i][0]);
            for (j = 1; j < m - k; ++j) {
                b[i - 1][j - 1] = ep(J[0][j])(J[i][j]);
            }
        }
        J = b;
    }
    return J.map((f) => f[0]);
};

/**
 * Gauss Seidel
 * @param A
 */
export const gaussSeidel =
    (err: number = epsilon()) =>
    (solini: number[][] = [[0]]) =>
    function*(A: any[][]) {
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
                console.info('Es posible que la solucion diverga');
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
            yield x; // x.slice();
            if (Math.min(...errEval) < err) {
                break;
            }
        }
    };

/**
 * Factorizacion LU
 * @param
 */
export const factorizacionLU = (A: number[][]) => {
    let n = A.length; // al ser una cuadrada sin sus term. indep., obtenemos el numero de incognitas.
    const U = copyMatrix(A);
    const L = zeros([n, n]);
    let i;
    let j;
    let k;
    // escalonar las  matrices L y U
    for (k = 0; k < n - 1; ++k) {
        if (U[k][k] === 0) {
            throw new Error(`Pivote nulo en fila ${k}`);
        } // evitar pivote nulo.
        for (i = k + 1; i < n; ++i) {
            L[i][k] = U[i][k] / U[k][k];
        }
        // L[k][k] = 1 no necesario para el calcular Y-subi
        for (i = k + 1; i < n; ++i) {
            const p = pivote(U[k][k])(U[i][k]); // seleccion del pivot.
            for (j = k + 1; j < n; ++j) { // no trabajamos sobre los terminos independientes,
                // los reutilizamos en el calculo de la matriz Y-subi.
                U[i][j] = p(U[k][j])(U[i][j]); // ascalonando de la matriz.
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
 * Método de la Matriz Inversa
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
        if (J[0][0] === 0) {
            throw new Error(`Pivote nulo en ${k} fila`);
        }
        for (j = 1; j < m - k; ++j) {
            b[n - 1][j - 1] = J[0][j] / J[0][0];
        }
        for (i = 1; i < n; ++i) {
            const ep = pivote(J[0][0])(J[i][0]);
            for (j = 1; j < m - k; ++j) {
                b[i - 1][j - 1] = ep(J[0][j])(J[i][j]);
            }
        }
        J = b;
        yield J;
    }
    yield multiply(J, C as number[][]);
}
