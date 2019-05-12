import { areOrderedPairs, isEquidistant, isPar } from './utils';
/**
 * Formula de los Trapecios
 * @param points Vector de pares ordenados (puntos).
 */
export const trapecios = (points: number[][]) => {
    if (!(Array.isArray(points) && areOrderedPairs(points))) {
        throw new Error('An array of ordered pairs was expected.');
    }
    const X = points.map(([x, y]: number[]) => x);
    if (!isEquidistant(X)) {
        throw new Error('This method is only for x-distant points.');
    }
    const h = Math.abs(points[0][0] - points[1][0]);
    const Y = points.map(([x, y]: number[]) => y);
    const n = Y.length;
    const E = Y[0] + Y[n - 1];
    let P = 0;
    let I = 0;
    for (let i = 1; i < n - 1; ++i) {
        if (i % 2) { P += Y[i]; }
        if (!(i % 2)) { I += Y[i]; }
    }
    return {
        h,
        E,
        P,
        I,
        integral: h * (E / 2 + P + I),
    };
};

export const simpson = (points: number[][]) => {
    if (!(Array.isArray(points) && areOrderedPairs(points))) {
        throw new Error('An array of ordered pairs was expected.');
    }
    const X = points.map(([x, y]: number[]) => x);
    if (!isEquidistant(X)) {
        throw new Error('This method is only for x-distant points.');
    }
    if (isPar(points.length)) {
        throw new Error('The number of points is not odd.');
    }
    const h = Math.abs(points[0][0] - points[1][0]);
    const Y = points.map(([x, y]: number[]) => y);
    const n = Y.length;
    const E = Y[0] + Y[n - 1];
    let P = 0;
    let I = 0;
    for (let i = 1; i < n - 1; ++i) {
        if (i % 2) { P += Y[i]; }
        if (!(i % 2)) { I += Y[i]; }
    }
    return {
        h,
        E,
        P,
        I,
        integral: (h / 3) * (E + 4 * I + 2 * P),
    };
};

type typeFnIntegral = (points: number[][]) => { integral: number };
/**
 * Regla de Tres Octavos de Simson
 * I = (3 * h / 8) * (Y(0) + 3 * Y(1) + 3 * Y(2) + Y(3))
 *  Para un numero par de puntos, o vale tambien decir, un número
 * impar de frnajas (sub-divisiones).
 */
export const threeEighthsSimpson = (points: number[][]) => (fnIntegral?: typeFnIntegral) => {
    if (!(Array.isArray(points) && areOrderedPairs(points))) {
        throw new Error('An array of ordered pairs was expected.');
    }
    const X = points.map(([x, y]: number[]) => x);
    if (!isEquidistant(X)) {
        throw new Error('This method is only for x-distant points.');
    }
    const h = Math.abs(points[0][0] - points[1][0]);
    const Y = points.map(([x, y]: number[]) => y);
    const n = Y.length;
    let integ = 0;
    let i;
    for (i = 0; i < n; i += 4) {
        integ += (3 * h / 8) * (Y[i] + 3 * Y[i + 1] + 3 * Y[i + 2] + Y[i + 3]);
    }
    if (fnIntegral && (i - 3) !== n) {
        const { integral } = fnIntegral(points.slice(i - 3))
        integ += integral;
    }
    return {
        h,
        integral: integ,
    };
};

// const ps = [
//     [0,.7071],
//     [1.5,.6325],
//     [2,.5774],
//     [2.5,.5345],
//     [3,.5],
//     [4,.481],
//     [5,0.456],
//     [6,.434],
// ]
// console.log(tresOctavosSimpson(ps)())
// console.log()
// console.log(tresOctavosSimpson(ps)(trapecios))
