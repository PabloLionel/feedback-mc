import { zeros, copyMatrix } from './sistemas.ecuaciones.nohomogeneas';
// import { identity } from 'mathjs';
/**
 * Eye
 * Devuelve una matriz Identidad si offset = 0.
 * Si offset = k, desplaza k posiciones los 1 de
 * la diagonal.
 * @param n dimension de la matriz identidad.
 * @param offset desplaza la posicion de los 1 de la diagonal.
 */
const eye = (n: number, offset = 0) => {
    const I = zeros([n, n]);
    for (let i = 0; i < n; ++i) {
        if (0 <= i + offset && i + offset < n) { I[i + offset][i + offset] = 1; }
    }
    return I;
};
/**
 * Trace
 * Devuelve la suma de la diagonal de una matriz, si
 * offset = 0.
 * Si offset = k, desplaza k posiciones la diagonal.
 * @param M matriz.
 * @param offset desplaza posiciones.
 */
const trace = (M: any[][], offset = 0) => {
    let s = 0;
    const n = M.length;
    for (let i = 0; i < n; ++i) {
        if (0 <= i + offset && i + offset < n) {
            s += M[i + offset][i + offset];
        }
    }
    return s;
};
/**
 * Dot Matrix Square
 * Producto de dos matrices cuadrada.
 * @param A Matriz
 * @param B Matriz
 */
const dotMatrixSquare = (A: any[][], B: any[][]): any[][] => {
    const n = A.length; // suponiendo que las matrices son cuadradas.
    const C = zeros([n, n]);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                C[i][j] += (A[i][k] * B[k][j]);
            }
        }
    }
    return C;
};
/**
 * Dot Matrix Square For Scale
 * Producto de matrices por un escalar.
 * @param A Matriz
 * @param k Escalar
 */
const dotMatrixSquareForScale = (A: any[][], k: number): any[][] => {
    const n = A.length; // suponiendo que las matrices son cuadradas.
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            A[i][j] *= k;
        }
    }
    return A;
};
/**
 * Sum Matrix Square
 * Suma de dos matrices.
 * @param A Matriz
 * @param B Matriz
 */
const sumMatrixSquare = (A: any[][], B: any[][]): any[][] => {
    const n = A.length;
    const C = zeros([n, n]);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
    return C;
};
/**
 * Faddeev Leverrier
 * @param A Matriz Homogena.
 */
export const faddeevLeverrier = (A: any[][]) => {
    const n = A.length;
    const I = eye(n);
    let AK = A;
    const P = [1];
    for (let k = 1; k <= n; ++k) {
        const c = -1 * trace(AK) / k;
        P.push(c);
        AK = dotMatrixSquare(A, sumMatrixSquare(AK, dotMatrixSquareForScale(I, c)));
    }
    const prod = Math.pow(-1, n);
    return P.map((b: number) => b * prod);
};

const errors = (l: number, l1: number, X: any[][], X1: any[][], n: number) => {
    // const ini = [Math.abs(l - l1)];
    // return ini.concat(X.map((x: any[], i: number) => []));
};
export const metPotMax =
    (A: any[][]) =>
    (l = 1) =>
    function*(err = .001): IterableIterator<any> {
        const n = A.length;
        let X = (new Array(n)).fill(0).map(() => [1]);
        let oldLambda = l;
        const X1 = copyMatrix(X);
        for (;;) {
            for (let i = 0; i < n; ++i) {
                for (let j = 0; j < n; ++j) {
                    X1[j][0] *= A[i][j] * X[j][0];
                }
            }
            const newLambda = X1[0][0] * l;
            for (let i = 0; i < n; ++i) { X1[i][0] = X1[i][0] / newLambda; }
            // if (err > Math.max(...errors(oldLambda, newLambda, X, X1, n))) {
            //     yield [X1, newLambda];
            // }
            yield [X1, newLambda];
            oldLambda = newLambda;
            X = X1;
        }
    };

