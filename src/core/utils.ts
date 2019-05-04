import {
    // matrix,
    // multiply,
    // ones,
    size,
    // inv,
    // identity,
    // trace,
    // add,
} from 'mathjs';
// [[[[[[[[[[[[[[[[[RAICES DE ECUACIONES]]]]]]]]]]]]]]]]]
/**
 * Interpretación geometrica del teorema de Bolzano
 * @param {*} x1
 */
export const bolzano = (f: any) => (a: number) => (b: number) =>
    f(a) * f(b) < 0;

// [[[[[[[[[[[[[[[[[ECUACIONES LINEALES SIMULTANEAS]]]]]]]]]]]]]]]]]

/**
 * Copy Matrix
 * @param M
 */
export const copyMatrix = (M: any[][]) => M.map((a) => a.slice());

/**
 * Pivote
 * @param
 */
export const pivote =
    (a11: number) =>
    (a21: number) =>
    (a12: number) =>
    (a22: number) =>
        a11 === 0 ?
        null
        : a22 - a12 * a21 / a11;

/**
 * Zeros
 * Generador de Arreglo o matriz de ceros.
 * @param A
 */
export const zeros = (dim: any) => {
    const [n, m] = dim;
    return m ?
        (new Array(n)).fill(0).map(() => (new Array(m)).fill(0))
        : (new Array(n)).fill(0);
};

/**
 * Eye
 * Devuelve una matriz Identidad si offset = 0.
 * Si offset = k, desplaza k posiciones los 1 de
 * la diagonal.
 * @param n dimension de la matriz identidad.
 * @param offset desplaza la posicion de los 1 de la diagonal.
 */
export const eye = (n: number, offset = 0) => {
    const I = zeros([n, n]);
    for (let i = 0; i < n; ++i) {
        if (0 <= i + offset && i + offset < n) {
            I[i + offset][i + offset] = 1;
        }
    }
    return I;
};

/**
 * Multiply
 * Retorna el producto de dos matrices.
 * @param A : number[][]
 * @param B : number[][]
 */
export const multiply = (A: number[][], B: number[][]) => {
    if (!A && !B
        || !B[0]
        || A[0].length !== B.length
    ) { return null; }
    const n = A.length;
    const m = B[0].length;
    const C: any[] = [];
    let i;
    let j;
    let k;
    for ( i = 0; i < n; ++i ) {
        C.push([].slice())
        for ( j = 0; j < m; ++j ) {
            C[i].push(0);
            for ( k = 0; k < n; ++k ) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
};

/**
 * Scalar
 * @param M : number[][]
 * @param k : number
 */
export const scalar = (M: number[][], k: number) =>{
    let i;
    let j;
    const [n, m] = size(M) as number[];
    for (i = 0; i < n; ++i) {
        for (j = 0; j < m; ++j) {
            M[i][j] *= k;
        }
    }
    return M;
};
