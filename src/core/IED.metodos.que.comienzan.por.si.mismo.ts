import { Ea } from './errores';
import {
    fnDifferential,
    T,
} from './utils';
/**
 * Modulo de métodos de Integración de Ecuaciones Diferenciales (IED)
 * Métodos que comienzan por si mismos.
 */
/**
 * @interface InputEuler
 *
 * @property {fnDifferential}   dy
 * @property {[number, number]} pointInit
 * @property {number}           h
 */
interface InputEuler {
    dy: fnDifferential;
    pointInit: T;
    h: number;
}
/**
 * @function euler - Integración de Euler
 *  Serie de avances de integracion.
 *
 * @param {InputEuler} o
 *
 * @returns Iterator<{ advance: T, dif: number }>
 */
export function* euler({dy, pointInit, h}: InputEuler): Iterable<{ advance: T, dif: number }> {
    let [x, y] = pointInit;
    while (1) {
        const dif = dy(x, y);
        yield {
            advance: [x, y],
            dif,
        };
        x += h;
        y += dif * h;
    }
}
/**
 * @interface InputModifiedEuler
 *
 * @property {fnDifferential}   dy
 * @property {[number, number]} pointInit
 * @property {number}           h
 * @property {number}           E
 */
interface InputModifiedEuler {
    dy: fnDifferential;
    pointInit: T;
    h: number;
    E: number;
}
/**
 * @function modifiedEuler - Integración de Euler Modificado
 *
 * @typedef {[number, number]} T
 *
 * @returns Iterable<{ advance: T, dif: number, P: number, Cs: number[]}>
 */
export function* modifiedEuler({dy, pointInit, h, E}: InputModifiedEuler)
    : Iterable<{ advance: T, dif: number, P: number, Cs: number[] }>  {
    /**
     * @function predictor - Predictor de Euler Modificado
     *
     * @param {number} y0
     * @param {number} dif0
     *
     * @returns {number}
     */
    const predictor = (y0: number, dif0: number): number => y0 + dif0 * h;
    /**
     * @function corrector - Corrector de Euler Modificado
     *
     * @param {number} y0
     * @param {number} yp0
     * @param {number} Pyp1
     *
     * @returns number
     */
    const corrector = (y0: number, yp0: number, Pyp1: number): number => y0 + ((yp0 + Pyp1) / 2) * h;
    let [x, y] = pointInit;
    let P = y;
    let Cs: number[] = [y];
    while (1) {
        const dif = dy(x, y);

        yield {
            advance: [x, y],
            dif,
            P,
            Cs,
        };

        P = predictor(y, dif); // predicho P(x(i))
        Cs = [].slice(); // Correcciones
        Cs.push(corrector(y, dif, dy(x + h, P)));
        let i = 0;
        do {
            Cs.push(corrector(y, dif, dy(x + h, Cs[i])));
            i++;
        } while (!(Ea(Cs[i])(Cs[i - 1]) < E));
        x += h;
        y += Cs[Cs.length - 1];
    }
}
/**
 * @interface InputRungeKutta
 *
 * @property {fnDifferential}   dy
 * @property {[number, number]} pointInit
 * @property {number}           h
 */
interface InputRungeKutta {
    dy: fnDifferential;
    pointInit: T;
    h: number;
}
/**
 * @function rungeKutta2ndOrder - Runge Kutta de Segundo Order
 *
 * @typedef {[number, number]} T
 *
 * @param {InputRungeKutta} o
 *
 * @returns Iterator<{ advance: T, dif: number }>
 */
export function* rungeKutta2ndOrder({dy, pointInit, h}: InputRungeKutta)
    : Iterable<{ advance: T, dif: number }> {
    let [x, y] = pointInit;
    while (1) {
        const dif = dy(x, y);
        yield {
            advance: [x, y],
            dif,
        };
        const k1 = h * dif;
        const k2 = h * dy(x + h, y + k1);
        y += (k1 + k2) / 2;
        x += h;
    }
}
/**
 * @function rungeKutta4thOrder - Runge Kutta de Cuarto Order
 *
 * @param {InputRungeKutta} o
 *
 * @returns Iterator<{ advance: T, dif: number }>
 */
export function* rungeKutta4thOrder({dy, pointInit, h}: InputRungeKutta)
: Iterable<{ advance: T, dif: number }>  {
    let [x, y] = pointInit;
    while (1) {
        const dif: number = dy(x, y);
        yield {
            advance: [x, y],
            dif,
        };
        const k1 = h * dif;
        const k2 = h * dy(x + h / 2, y + k1 / 2);
        const k3 = h * dy(x + h / 2, y + k2 / 2);
        const k4 = h * dy(x + h, y + k3);
        y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        x += h;
    }
}
