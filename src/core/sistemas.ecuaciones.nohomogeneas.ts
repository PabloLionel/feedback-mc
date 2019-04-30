import { clone } from 'mathjs';

/**
 * Copy Matrix
 * @param M
 */
export const copyMatrix = (M: any[][]) => M.map((a) => a.slice());
/**
 * Pivote
 * @param
 */
const pivote =
    (a11: number) =>
    (a21: number) =>
    (a12: number) =>
    (a22: number) =>
        a11 === 0 ?
        null
        : a22 - a12 * a21 / a11;
/**
 * Eliminacion Gaussiana
 * @param A
 */
export const eliminacionGaussiana = (A: number[][]) => {
    const G = clone(A);
    let n = A.length;
    let m = A[0].length;
    for (let k = 0; k < n - 1; ++k) { // escalonado de la matriz
        if (G[k][k] === 0) { throw new Error(`Pivote nulo en fila y columna ${k}.`); }
        for (let i = k + 1; i < n; ++i) {
            const ep = pivote(G[k][k])(G[i][k]);
            for (let j = k + 1; j < m; ++j) {
                G[i][j] = ep(G[k][j])(G[i][j]);
            }
            G[i][k] = 0;
        }
    }
    // Sustitución inversa
    const x = (new Array(n)).fill(0);
    n -= 1;
    m -= 1;
    for (let i = n; i > -1; --i) {
        let s = 0;
        for (let j = i; j < n; ++j) {
            s += G[i][j + 1] * x[j + 1];
        }
        x[i] = (G[i][m] - s) / G[i][i];
    }
    return x;
};

// const log = console.log;
// log(eliminacionGaussiana(
//     [
//         [2, 6, 1, 7],
//         [1, 2, -1, -1],
//         [5, 7, -4, 9],
//     ],
// )); // [ 10, -3, 5 ]
// log(eliminacionGaussiana(
//     [
//         [2, 3, 0, 8],
//         [4, 5, 1, 15],
//         [2, 0, 4, 1],
//     ],
// )); // [ 8.5, -3, -4 ]

/**
 * Zeros
 * Generador de Arreglo o matriz de ceros.
 * @param A
 */
export const zeros = (dim: [number] | [number, number]) => {
    const [n, m] = dim;
    return m ?
        (new Array(n)).fill(0).map(() => (new Array(m)).fill(0))
        : (new Array(n)).fill(0);
};
/**
 * Gauss Jordan
 * @param A
 */
export const gaussJordan = (A: any[][]) => {
    const n = A.length;
    const m = A[0].length;
    let J = copyMatrix(A);
    let b;
    for (let k = 0; k < n; ++k) {
        b = zeros([n, n - k]);
        if (J[0][0] === 0) { throw new Error(`Pivote nulo en ${k} fila`); }
        for (let j = 0; j < m - k; ++j) {
            b[n - 1][j - 1] = J[0][j] / J[0][0];
        }
        for (let i = 1; i < n; ++i) {
            const ep = pivote(J[0][0])(J[i][0]);
            for (let j = 1; j < m - k; ++j) {
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
    (maxiter: number) =>
    (err: number) =>
    (solini: number[][] = [[0]]) =>
    (A: any[][]) => {
        const n = A.length;
        if (solini[0].length === 1) {
            solini[0] = zeros([n]);
        }
        // compruebe si la matriz A es diagonalmente dominante.
        let ini = true;
        let s;
        for (let i = 0; i < n; ++i) {
            s = 0;
            for (let j = 0; j < i; ++j) {
                s += Math.abs(A[i][j]);
            }
            for (let j = i + 1; j < n; ++j) {
                s += Math.abs(A[i][j]);
            }
            if (Math.abs(A[i][i]) < s) {
                ini = false;
                // tslint:disable-next-line:no-console
                console.info('Es posible que la solucion diverga');
                break;
            }
        }
        const S = copyMatrix(A);
        err = Math.abs(err);
        const errEval = (new Array(n)).fill(1);
        while (maxiter--) {
            const x = zeros([n]);
            for (let i = 0; i < n; ++i) {
                s = 0;
                for (let j = 0; j < i; ++j) {
                    s += S[i][j] * solini[solini.length - 1][j];
                }
                for (let j = i + 1; j < n; ++j) {
                    s += S[i][j] * solini[solini.length - 1][j];
                }
                x[i] = (S[i][S[i].length - 1] - s) / S[i][i];
                errEval[i] = Math.abs(x[i] - solini[solini.length - 1][i]);
            }
            solini.push(x.slice());
            if (Math.min(...errEval) < err) {
                break;
            }
        }
        return solini;
    };

// log(gaussSeidel(20)(.001)()(
//     [
//         [12, 6, 1, 7],
//         [1, 2, -1, -1],
//         [5, 7, 15, 9],
//     ],
// ));
// exacto: [ 0.8411214953271029, -0.6168224299065421, 0.6074766355140188 ];
// aprox.: [ 0.8345318930041152, -0.6068441358024692, 0.6077438271604938 ]

/**
 * Factorizacion LU
 * @param
 */
export const factorizacionLU = (A: any[][]) => {
    let n = A.length; // al ser una cuadrada sin sus term. indep., obtenemos el numero de incognitas.
    const U = copyMatrix(A);
    const L = zeros([n, n]);
    // escalonar las  matrices L y U
    for (let k = 0; k < n - 1; ++k) {
        if (U[k][k] === 0) { throw new Error(`Pivote nulo en fila ${k}`); } // evitar pivote nulo.
        for (let i = k + 1; i < n; ++i) {
            L[i][k] = U[i][k] / U[k][k];
        }
        // L[k][k] = 1 no necesario para el calcular Y-subi
        for (let i = k + 1; i < n; ++i) {
            const p = pivote(U[k][k])(U[i][k]); // seleccion del pivot.
            for (let j = k + 1; j < n; ++j) { // no trabajamos sobre los terminos independientes,
                // los reutilizamos en el calculo de la matriz Y-subi.
                U[i][j] = p(U[k][j])(U[i][j]); // ascalonando de la matriz.
            }
            U[i][k] = 0;
        }
    }
    // L[n-1][n-1] = 1 no necesario para el calcular Y-subi
    // calculo de la matris Y-subi (L * y = b)
    // yi = [0] * n, reutilizamos los terminos independientes de U como si fuese la matriz de incognitas Y-subi.
    for (let i = 0; i < n; ++i) {
        let s = 0;
        for (let j = 0; j < i; ++j) {
            s += L[i][j] * U[j][U[j].length - 1];
        }
        U[i][U[i].length - 1] = U[i][U[i].length - 1] - s;
    }
    // calculo de las incognitas (U * x = y)
    const x = zeros([n]);
    n--;
    for (let i = n; i > -1; --i) {
        let s = 0;
        for (let j = i; j < n; ++j) {
            s += U[i][j + 1] * x[j + 1];
        }
        x[i] = (U[i][U[i].length - 1] - s) / U[i][i];
    }
    return x;
};

