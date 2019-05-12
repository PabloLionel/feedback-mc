import { Ea } from './errores';
import { fnDiferencial } from './utils';
/**
 * Modulo de métodos de Integración de Ecuaciones Diferenciales (IED)
 * Métodos que comienzan por si mismos.
 */

interface InputEuler {
    dy: fnDiferencial;
    pointInit: [number, number];
    h: number;
}
/**
 * Integración de Euler
 * @returns serie de avances de integracion [iterable].
 */
export function* euler({dy, pointInit, h}: InputEuler): Iterable<{ advance: [number, number], dif: number }> {
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
interface InputModifiedEuler {
    dy: fnDiferencial;
    pointInit: [number, number];
    h: number;
    E: number; // error
}
/**
 * Integración de Euler
 * @returns serie de avances de integracion [iterable].
 */
export function* modifiedEuler({dy, pointInit, h, E}: InputModifiedEuler)
    : Iterable<{ advance: [number, number], dif: number, P: number, Cs: number[] }>  {
    const predictor = (y0: number, dif0: number): number => y0 + dif0 * h;
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
interface InputRungeKutta {
    dy: fnDiferencial;
    pointInit: [number, number];
    h: number;
}
export function* rungeKutta2ndOrder({dy, pointInit, h}: InputRungeKutta)
    : Iterable<{ advance: [number, number], dif: number }> {
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

export function* rungeKutta4thOrder({dy, pointInit, h}: InputRungeKutta)
: Iterable<{ advance: [number, number], dif: number }>  {
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
