import {
    isEquidistant,
    range,
    resolvent,
    production,
    T,
} from './utils';
/**
 * @function equidistant - Equidistante
 *  Y' = [y'0, y'1, y'2, ...]
 *
 * @param {number[]} Y  Vector de números.
 *
 * @returns number[]
 */
const equidistant = (Y: number[]) =>
    [...range(Y.length - 1)]
        .map((i: number) => Y[i + 1] - Y[i]);

/**
 * @function notEquidistant - No Equidistante
 * [Curryficada]
 *  y'(i) = (y(i + 1) - y(i)) / (x(i + jump) - x(i))
 *  Función Curryficada para recibir el vector de distancias X
 * para un vector de imagen Y.
 *  Retorna un vector de diferencias avanzadas divididas respecto
 * a Y.
 * Y' = [y'0, y'1, y'2, ...]
 * @param {number[]}        X Vector de números de distancias.
 * @param {number[]}        Y Vector de números de imagen.
 *
 * @returns number[][]
 */
const notEquidistant =
    (X: number[]) =>
        (Y: number[]) => {
            const n = Y.length;
            const jump = X.length - Y.length + 1;
            const res = [];
            for (let i = 0; i < n; ++i) {
                res.push((Y[i + 1] - Y[i]) / (X[i + jump] - X[i]));
            }
            return res;
        };
/**
 * @function advancedDifferences - Diferencias Avanzadas
 *
 * @param {Function} fn Funcion para valores equidistante o no equidistante.
 * @param {number[]} Y Vector de números que representan la imagen.
 */
const advancedDifferences =
    (fn: any) =>
        (Y: number[]): number[][] =>
            Y.length === 1 ?
                [Y]
                : [Y].concat(advancedDifferences(fn)(fn(Y)));
/**
 * Tabular
 *  Recibe un vector de pares ordenados y devuelve una matriz
 * de longitud escalonada que representa una tabla de diferencias
 * avanzadas.
 * points = [
 *  [x0, y0],
 *  [x1, y1],
 *  [x2, y2],
 *  ...
 * ]
 * @typedef {[number, number]} T
 *
 * @param {T[]} points  Vector de pares ordenados de numeros.
 *
 * @returns number[][]
 *
 * @example
 * // (equidistante)
 * const points = [
 *  (15,0.965926),
 *  (25,0.906308),
 *  (35,0.819152),
 *  (45,0.707107),
 *  (55,0.573576),
 *  (65,0.422618),
 * ]
 * const tDiffAvanzadas = tabular(points)
 *
 * // Resultados tabulados:
 * // Tabla de Diferencias Avanzadas
 * //  =[x]=====[y]==============================================
 * //  15.0000 0.96593 -0.05962 -0.02754 0.00265 0.00075 -0.00010
 * //  25.0000 0.90631 -0.08716 -0.02489 0.00340 0.00066
 * //  35.0000 0.81915 -0.11204 -0.02149 0.00406
 * //  45.0000 0.70711 -0.13353 -0.01743
 * //  55.0000 0.57358 -0.15096
 * //  65.0000 0.42262
 * // [index>] =[0]=====[1]======[2]=====[3]=====[4]=====[5]=====
 * // Ejemplo: points (no equidistante) = [
 * //  (0.00,1.00000),
 * //  (0.40,1.63246),
 * //  (0.75,1.86603),
 * //  (1.50,2.22474),
 * //  (2.00,2.41421),
 * // ]
 * // Resulta:
 * // Tabla de Diferencias Avanzadas divididas:
 * //  =[x]=====[y]=====================================
 * //  0.00000 1.00000 1.58115 -1.21841 0.69769 -0.31997
 * //  0.40000 1.63246 0.66734 -0.17188 0.05775
 * //  0.75000 1.86603 0.47828 -0.07947
 * //  1.50000 2.22474 0.37894
 * //  2.00000 2.41421
 * // [index>] =[0]=====[1]=====[2]=====[3]=====[4]=====
 */

export const tabular = (points: T[]) => {
    points.sort();
    const X = points.map(([x, y]: T) => x);
    const Y = points.map(([x, y]: T) => y);
    return isEquidistant(X) ?
        advancedDifferences(equidistant)(Y)
        : advancedDifferences(notEquidistant(X))(Y);
};
/**
 * @interface InputInterpoReverse
 *
 * @property {number}           y : valor de la funcion aplicado al punto desconocido x de y = P(x).
 * @property {number}           h : x-distancia de los puntos.
 * @property {[number, number]} pointInit : punto inicial que contiene el mayor valor de absisa x
 * menor al valor a interpolar, p(init) = (x0, y0).
 * @property {number}           inc : primer incremento de y0, tabulado de los valores de la imagen.
 */
export interface InputInterpoReverse {
    y: number;
    h: number;
    pointInit: [number, number]; // p(0) = (x0, y0)
    inc: number;
}
/**
 * @function linearReverseInterpolation - Método de Interpolación Inversa Lineal
 * y = P(x) => x = x0 + ((y - y0) * h) / Δy0, con x desconocido.
 *
 * @param {InputInterpoReverse} o
 */
export const linearReverseInterpolation = ({ y, h, pointInit, inc }: InputInterpoReverse) =>
    pointInit[0] + (y + pointInit[1]) * h / inc;

/**
 * @interface InputInterpoQuadratic
 *
 * @property {number} y         valor de la funcion aplicado al punto desconocido x de y = P(x).
 * @property {number} h         x-distancia de los puntos.
 * @property {T}      pointInit punto inicial que contiene el mayor valor de absisa x menor
 * al valor a interpolar, p(init) = (x0, y0).
 * @property {number} x1        siguiente punto respecto x0 del punto inicial.
 * @property {number} inc1      primer incremento de y0, tabulado de los valores de la imagen.
 * @property {number} inc2      segundo incremento de y0, tabulado de los valores de la imagen.
 *
 */
export interface InputInterpoQuadratic {
    y: number;
    y0: number;
    h: number;
    pointInit: [number, number];
    x1: number;
    inc1: number; // of y0
    inc2: number; // of y0
}
/**
 * @function quadraticInverseInterpolation - Método de Interpolación Inversa Cuadratica
 * y = P(x) =>
 *      a = (Δ²)y0 / 2h²
 *      b = (Δy0 / h) - a * (x0 + x1)
 *      c = y0 + (a * x1 - (Δy0 / h)) * x0 - y
 * [r1, r2] = resolvente_cuadratica(a, b, c)
 * Donde: x = r1 si r1 ∈ (x0; x1) o x = r2 si r2 ∈ (x0; x1)
 *
 * @typedef {[number, number]} T
 *
 * @param {InputInterpoQuadratic} o
 *
 * @returns Object<{{
 *       a: number,
 *       b: number,
 *       c: number,
 *       resolvent: [number, number],
 *       x: number,
 * }>
 */
export const quadraticInverseInterpolation = ({ y, h, pointInit, x1, inc1, inc2 }: InputInterpoQuadratic) => {
    const [x0, y0] = pointInit;
    const a = inc2 / 2 * h ** 2;
    const aux = inc1 / h;
    const b = aux - a * (pointInit[0] + x1);
    const c = y0 + (a * x1 - aux) * x0 - y;
    const rs = resolvent(a, b, c);
    return {
        a,
        b,
        c,
        resolvent: rs,
        x: x0 < rs[0] && rs[0] < x1 ? rs[0] : rs[1],
    };
};
/**
 * @interface InputMu
 *
 * @property {number[][]}   points  Vector de puntos.
 * @property {number}       x       Número a interpolar.
 * @property {boolean}      asc     Boolean que indica que la tabla es ascendente.
 */
export interface InputMu {
    points: number[][];
    x: number;
    asc: boolean;
}
/**
 * @function mu - Mu
 * μ = (x - x0) / h
 *
 * @param {InputMu} o
 *
 * @returns Object<{ index: number, u: number }>.
 */
const mu = ({ points, x, asc }: InputMu): { index: number, u: number } => {
    const n = points.length;
    if (n > 1) { throw new Error('At least two points were expected.'); }
    if (x <= points[0][0] || points[n - 1][0] <= x) {
        throw new Error(`Value of x to interpolate outside the range (${points[0][0]}; ${points[n - 1][0]}).`);
    }
    let i;
    if (asc) {
        i = 0;
        while (x > points[i + 1][0]) { i++; }
    } else {
        i = points.length;
        while (x < points[i - 1][0]) { i--; }
    }
    return {
        index: i,
        u: (x - points[i][0]) / Math.abs(points[0][0] - points[1][0]),
    };
};
/**
 * @function newtonGregoryAscending - Formula de Newton Gregory Ascendente
 * [Curryficada]
 *  P(n)(x) = y0 + ((x-x0)/h) * Δy0 + ((x-x1)(x-x0)/2h²) * Δ²y0 +...+ ((x-x(n-1))...(x-x1)(x-x0)/n!h^n) * Δ^ny0
 *
 * @param {number} points    .
 * @param {number} tab       .
 * @param {number} x         .
 *
 * @returns number
 */
export const newtonGregoryAscending =
    (points: T[]) =>
        (tab: number[][]) =>
            (x: number) => {
                const prods = (muConst: number, top: number) =>
                    top < 1 ?
                        1
                        : production([...range(top)]
                            .map((s: number) => muConst - s));
                const { index, u } = mu({
                    points,
                    x,
                    asc: true,
                });
                const n = tab.length - index;
                let res = 0;
                let fac = 1;
                for (let i = 0; i < n; ++i) {
                    fac *= i === 0 ? 1 : i; // factorial
                    res += tab[i][index] / fac * prods(u, i);
                }
                return res;
            };
/**
 * @function newtonGregoryDescending - Formula de Newton Gregory Ascendente
 * [Curryficada] fn = points => tab => x => y'
 *  P(n)(x) = y0 + ((x-x0)/h) * Δy0 + ((x-x1)(x-x0)/2h²) * Δ²y0 +...+ ((x-x(n-1))...(x-x1)(x-x0)/n!h^n) * Δ^ny0
 *
 * @typedef {[number, number]} T
 *
 * @param {T[]}         points  Conjunto de pares ordenados
 * @param {number[][]}  tab     Tabla de diferencias.
 * @param {number}      x       valor de absisa a interpolar.
 *
 * @returns number
 *
 * @example
 *
 */
export const newtonGregoryDescending =
    (points: T[]) =>
        (tab: number[][]) =>
            (x: number) => {
                const prods = (muConst: number, top: number) =>
                    top < 1 ?
                        1
                        : production([...range(top)]
                            .map((s: number) => muConst + s));
                const { index, u } = mu({
                    points,
                    x,
                    asc: false,
                });
                const n = index + 1;
                let res = 0;
                let fac = 1;
                for (let i = 0; i < n; ++i) {
                    fac *= i === 0 ? 1 : i; // factorial
                    res += tab[i][index - i] / fac * prods(u, i);
                }
                return res;
            };
/**
 * @function lagrange - Lagrange
 *  Método para interpolar valores no x-distantes.
 *
 * @typedef {[number, number]} T
 *
 * @param {T[]}     points
 * @param {number}  x
 *
 * @returns number
 */
export const lagrange =
    (points: T[]) =>
        (x: number) => {
            const prods = (ps: number[][], factorIni: number, len: number) => {
                let pro = factorIni;
                let i;
                for (i = 0; i < len; ++i) {
                    pro *= ps[len][0] - ps[i][0];
                }
                for (i = n + 1; i < points.length; ++i) {
                    pro *= ps[len][0] - ps[i][0];
                }
                return pro;
            };
            const subPoints = points.map((p: number[]) => x - p[0]);
            const n = points.length;
            let s = 0;
            for (let i = 0; i < n; ++i) {
                s += points[i][1] / prods(points, subPoints[i], i);
            }
            return s * production(subPoints);
        };

/**
 * @function progressiveParabolicInterpolation - Interpolación Parabolica Progresiva.
 *
 * @typedef {[number, number]} T
 *
 * @param {T[]}         points  Conjunto de pares ordenados
 * @param {number[][]}  tab     Tabla de diferencias.
 * @param {number}      x       valor de absisa a interpolar.
 *
 * @returns Iterator<number>
 */
export const progressiveParabolicInterpolation =
    (points: T[]) =>
        (tab: number[][]) =>
            function*(x: number) {
                const prods = (indexInit: number, top: number) =>
                    top < 1 ?
                        1
                        : production([...range(top)]
                            .map((i: number) => x - points[indexInit + i][0]));
                const { index } = mu({
                    points,
                    x,
                    asc: true,
                });
                const n = tab.length - index;
                let s = 0;
                for (let i = 0; i < n; ++i) {
                    s += tab[i][index] * prods(index, i);
                    yield s;
                }
            };
