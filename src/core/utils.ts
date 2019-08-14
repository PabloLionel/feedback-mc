import {
    size,
} from 'mathjs';

export type T = [number, number];

// [[[[[[[[[[[[[[[[[RAICES DE ECUACIONES]]]]]]]]]]]]]]]]]
/**
 * @function bolzano - Interpretación geometrica del teorema de Bolzano
 * [curryficado]
 *
 * @param {Function} f  Función a analizar.
 * @param {Function} f  Función a analizar.
 * @param {Function} f  Función a analizar.
 *
 * @returns Boolean
 */
export const bolzano =
    (f: any) =>
        (a: number) =>
            (b: number) =>
                f(a) * f(b) <= 0;

// [[[[[[[[[[[[[[[[[ECUACIONES LINEALES SIMULTANEAS]]]]]]]]]]]]]]]]]
/**
 * @function copyMatrix - Copy Matrix
 * @param M
 */
export const copyMatrix = (M: any[][]) =>
    M.map((a) => a.slice());

/**
 * @function pivote - Pivote
 * [curryficado]
 *  pv = a22 - a12 * a21 / a11.
 *
 * @param {number} a11
 * @param {number} a21
 * @param {number} a12
 * @param {number} a12
 *
 * @returns number
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
 * @function zeros Zeros
 *  Generador de Arreglo o matriz de ceros.
 *
 * @param {[number, number?]}   dim Dimensiones a respetar.
 *
 * @returns number[] | number[][]
 */
export const zeros = (dim: [number, number?]) => {
    const [n, m] = dim;
    if (!n) { return []; }
    return m ?
        (new Array(n)).fill(0).map(() => (new Array(m)).fill(0))
        : (new Array(n)).fill(0);
};

/**
 * @function eye - Eye
 * Devuelve una matriz Identidad si offset = 0.
 * Si offset = k, desplaza k posiciones los 1 de
 * la diagonal.
 *
 * @param {number} n        Dimension de la matriz identidad.
 * @param {number} offset   Desplaza la posicion de los 1 de la diagonal.
 *
 * @returns number[][]
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
 * @function multiply - Multiply
 *  Retorna el producto de dos matrices.
 *
 * @param {number[][]} A
 * @param {number[][]} B
 *
 * @returns number[][]
 */
export const multiply = (A: number[][], B: number[][]) => {
    if (!A && !B
        || !B[0]
        || A[0].length !== B.length
    ) { return [[]]; }
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
 * @function scalar - Scalar
 *
 * @param {number[][]}  M
 * @param {number}      k
 *
 * @returns number[]
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
 * @function isEquidistant - Es Equidistante
 *  Para todo h(i) = abs(x(i + 1) - x(i)), con i = 0, 1, 2, ...
 *  Determina que todos las distancian entre X(i) y X(i + 1) sean iguales.
 * @param X     Vector de números de absisa.
 *
 * @returns Boolean
 */
export const isEquidistant = (X: number[]) => {
    const h = Math.abs(X[1] - X[0]);
    for (let i = 2; i < X.length; ++i) {
        if (h !== Math.abs(X[i - 1] - X[i])) { return false; }
    }
    return true;
};
/**
 * @function areOrderedPairs - Son Pares ordenados
 *  Comprueba que un conjunto esta formado por solo pares ordenados.
 *
 * @typedef {[number, number]} T
 *
 * @param {T[]} v
 */
export const areOrderedPairs = (v: T[]) =>
    v.every(([x, y]: T) => typeof x === typeof y);

// [[[[[[[[[[[[[[[[[INTEGRACION DE ECUACIONES DIFERENCIALES]]]]]]]]]]]]]]]]]
export type fnDifferential = (x: number, y: number) => number;

// [[[[[[[[[[[[[[[[[GENERAL]]]]]]]]]]]]]]]]]

/**
 * @function range
 *  Inspirado en el metodo range() de Python.
 *
 * @see https://docs.python.org/3/library/stdtypes.html#typesseq-range
 *
 * @param {number[]} args
 *
 * @returns Iterator<number>
 */
export function* range(...args: number[]) {
    let start: number;
    let end: number;
    let increment: number;
    switch (args.length) {
        case 0:
            throw new Error('range expected 1 arguments, got 0');
        case 1:
            [start, end, increment] = [0, args[0], 1];
            break;
        case 2:
            [start, end, increment] = [...args, 1];
            break;
        case 3:
            [start, end, increment] = args;
            break;
        default:
            throw new Error('range expected at most 3 arguments, got 4.');
    }
    // @ts-ignore
    while (start < end) {
        // @ts-ignore
        yield start;
        // @ts-ignore
        start += increment;
    }
}
/**
 * @function resolvent - Resolvente cuadratica
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 *
 * @returns [number, number]
 */
export function resolvent(a: number, b: number, c: number) {
    if (a === 0) { throw new Error('The main coefficient can not be zero.'); }
    const aux0 = 2 * a;
    const  det = b ** 2 - 4 * a * c; // determinante
    const aux1 = -b / aux0;
    const aux2 = Math.sqrt(det) / aux0;
    return [aux1 + aux2, aux1 - aux2];
}
/**
 * @function production - Productoria
 *  Calcula el producto de todos los valores del vector.
 *
 * @param {number[]} v arreglo de números.
 *
 * @returns number
 */
export const production = (v: number[]) =>
    v.reduce((x: number, y: number) => x * y);
/**
 * @function isPar
 *
 * @param {number} n
 *
 * @returns Boolean
 */
export const isPar = (n: number) => !!(n % 2);
/**
 * @function isImpar
 *
 * @param {number} n
 *
 * @returns Boolean
 */
export const isImpar = (n: number) => !isPar(n);
