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
        C.push([].slice());
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
export const scalar = (M: number[][], k: number) => {
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
// [[[[[[[[[[[[[[[[[INTERPOLACIÓN Y AJUSTE]]]]]]]]]]]]]]]]]
/**
 * Es Equidistante
 *  Para todo h(i) = abs(x(i + 1) - x(i)), con i = 0, 1, 2, ...
 *  Determina que todos las distancian entre X(i) y X(i + 1) sean iguales.
 * @param X Vector de números de absisa.
 * @returns Verdadero o Falso.
 */
export const isEquidistant = (X: number[]) => {
    const h = Math.abs(X[1] - X[0]);
    for (let i = 2; i < X.length; ++i) {
        if (h !== Math.abs(X[i - 1] - X[i])) { return false; }
    }
    return true;
};
/**
 * Son Pares ordenados
 *  Comprueba que un conjunto esta formado por solo pares ordenados.
 */
export const areOrderedPairs = (v: any) =>
    v.every(([x, y]: any) => typeof x === typeof y);

// [[[[[[[[[[[[[[[[[INTEGRACION DE ECUACIONES DIFERENCIALES]]]]]]]]]]]]]]]]]
export type fnDiferencial = (x: number, y: number) => number;

// [[[[[[[[[[[[[[[[[GENERAL]]]]]]]]]]]]]]]]]
export function* range(...args: number[]) {
    let start: number;
    let end: number;
    let increment: number;
    switch (args.length) {
        case 0:
            throw new Error('range expected 1 arguments, got 0');
        case 1:
            start = 0;
            end = args[0];
            increment = 1;
            break;
        case 2:
            start = args[0];
            end = args[1];
            increment = 1;
            break;
        case 3:
            start = args[0];
            end = args[1];
            increment = args[2];
            break;
    }
    // @ts-ignore
    while (start < end) {
        // @ts-ignore
        yield start;
        // @ts-ignore
        start += increment;
    }
}

export function resolvent(a: number, b: number, c: number) {
    if (a === 0) { throw new Error('The main coefficient can not be zero.'); }
    const aux0 = 2 * a;
    const  det = b ** 2 - 4 * a * c; // determinante
    const aux1 = -b / aux0;
    const aux2 = Math.sqrt(det) / aux0;
    return [aux1 + aux2, aux1 - aux2];
}
/**
 * Productoria
 * @param v arreglo de números.
 * @returns producto de todos los valores del vector.
 */
export const production = (v: number[]) =>
    v.reduce((x: number, y: number) => x * y);

export const isPar = (n: number) => !!(n % 2);
export const isImpar = (n: number) => !isPar(n);
