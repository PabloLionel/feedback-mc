import {
    fnDifferential,
    T,
} from './utils';
import { Ea } from './errores';

/**
 * Modulo de métodos de Integración de Ecuaciones Diferenciales (IED)
 * Métodos que comienzan por si mismos.
 */

 /**
  * @typedef {Iterator} It
  *
  * @property {[number, number]}    advance [x, y] Reprecentan una coordenada del avance de integración.
  * @property {number}              dif     Diferencial de y.
  * @property {number}              P?      P(y(i+1)) Predicho de y.
  * @property {number[]}            Cs?     Arreglo de Correcciones de y (C(y(i+1)))
  */

 /**
  * @interface Input - Generalización de entradas esperadas
  *
  * @property {fnDifferential} dy   Función diferencial.
  * @property {Iterator<It>} it     Objeto iterable con momentos de integración.
  * @property {number} h            Valor de x-distancia.
  */
interface Input {
    dy: fnDifferential;
    it: Iterator<{ advance: T, dif: number, P?: number, Cs?: number[] }>;
    h: number;
}
/**
 * @interface InputIED
 *
 * @extends Input
 *
 * @property {number} E     Cota superior de error.
 */
interface InputIED extends Input {
    E: number;
}
/**
 * @interface {InputPreCor} InputPreCor
 *
 * @property {[number, number]} advance [y<sub>0</sub>, y<sub>1</sub>]
 * @property {number} dif               :
 */
interface InputPreCor {
    advance: T;
    dif: number;
}

/**
 * @function milne
 * M(y(i+1)) =
 *  Devuelve un iterable con los momentos de integración,
 * luego de los primeros cuatro momentos se aplica el método de Milne.
 *
 * @param {Object<InputIED>} config
 *
 * @returns Iterator<It>
 *
 * @example --
 */
export function* milne({ dy, it, h, E }: InputIED)
    : Iterator<{ advance: T, dif: number, P: number, Cs: number[] }> {

    /**
     * @function predictor - Milne
     *  P(y(i+1)) = y(i-3) + A = y(i-3) + (4/3)h [2y'(i) - y'(i-1) + 2y'(i-2)]
     *
     * @param {InputPreCor[]} input  Ultimas cuatro integraciones.
     *
     * @returns number
     */
    const predictor = (input: InputPreCor[]): number =>
        input[0].advance[1] + 4 * h * (2 * input[3].dif - input[2].dif + 2 * input[1].dif) / 3;
    /**
     * @function corrector - Milne
     *  C(y(i+1)) = y(i-1) + (h/3) [y'(i-1) + 4y'(i) + P(y'(i-2))]
     * @param {InputPreCor[]}   input   Ultimas cuatro integraciones.
     * @param {number}          Pyprima P(y'(i+1)) predichi de y'
     *
     * @returns number
     */
    const corrector = (input: InputPreCor[], Pyprima: number): number =>
        input[2].advance[1] + h * (input[2].dif + 4 * input[3].dif + Pyprima) / 3;

    const integration: InputPreCor[] = [];

    for (let i = 0; i < 4; ++i) {
        const input = it.next().value;
        const output = {
            advance: input.advance,
            dif: input.dif,
        };
        yield Object.assign({}, output, {
            P: input.P ? input.P : input.advance[1],
            Cs: input.Cs ? input.Cs : [input.advance[1]],
        });
        integration.push(output);
    }
    let x = integration[3].advance[0];
    let y = integration[3].advance[1];
    for (; ;) {

        const P = predictor(integration);
        const Cs: number[] = [].slice();

        Cs.push(corrector(integration, dy(x + h, P)));
        let i = 0;
        do {
            Cs.push(corrector(integration, dy(x + h, Cs[Cs.length - 1])));
            ++i;
        } while (!(Ea(Cs[i])(Cs[i - 1]) < E));

        x += h;
        y += Cs[Cs.length - 1];

        integration.push({ advance: [x, y], dif: dy(x, y) });
        integration.shift(); // eliminamos el elemento i sub cero.

        yield Object.assign({}, integration[3], {
            P,
            Cs,
        });
    }
}
/**
 * @function generalizedMilne
 *
 * @param {Object<InputIED>} o
 */
export function* generalizedMilne({ dy, it, h, E }: InputIED)
    : Iterator<{ advance: T, dif: number, P: number, Cs: number[] }> {
    throw new Error('Method not implemented');
}

/**
 * @function hamming
 *  Devuelve un iterable con los momentos de integración,
 * luego del cuatro momentos se aplica Hamming.
 *
 * @param {Object<InputIED>} o
 *
 * @returns Iterator<It>
 *
 * @example --
 */
export function* hamming({ dy, it, h, E }: InputIED)
    : Iterator<{ advance: T, dif: number, P: number, Cs: number[] }> {
    /**
     * @function predictor - Hamming
     *  P(y(i+1)) =
     *
     * @param {InputPreCorMilne[]} input  Ultimas cuatro integraciones.
     *
     * @returns number
     */
    const predictor = (input: InputPreCor[]): number =>
        input[0].advance[1] + 4 * h * (2 * input[3].dif - input[2].dif + 2 * input[1].dif) / 3;
    /**
     * @function corrector - Hamming
     *  C(y(i+1)) =
     *
     * @param {InputPreCor[]}   input   Ultimas cuatro integraciones.
     * @param {number}          Pyprima P(y'(i+1)) predichi de y'
     *
     * @returns number
     */
    const corrector = (input: InputPreCor[], Pyprima: number): number =>
        (9 * input[3].advance[1] - input[1].advance[1] + 3 * h *
            (Pyprima + 2 * input[3].dif - input[2].dif)) / 8;

    const integration: InputPreCor[] = [];

    for (let i = 0; i < 4; ++i) {
        const input = it.next().value;
        const output = {
            advance: input.advance,
            dif: input.dif,
        };
        yield Object.assign({}, output, {
            P: input.P ? input.P : input.advance[1],
            Cs: input.Cs ? input.Cs : [input.advance[1]],
        });
        integration.push(output);
    }
    let x = integration[3].advance[0];
    let y = integration[3].advance[1];
    for (; ;) {

        const P = predictor(integration);
        const Cs: number[] = [].slice();

        Cs.push(corrector(integration, dy(x + h, P)));
        let i = 0;
        do {
            Cs.push(corrector(integration, dy(x + h, Cs[Cs.length - 1])));
            ++i;
        } while (!(Ea(Cs[i])(Cs[i - 1]) < E));

        x += h;
        y += Cs[Cs.length - 1];
        integration.push({ advance: [x, y], dif: dy(x, y) });
        integration.shift();

        yield Object.assign({}, integration[3], {
            P,
            Cs,
        });
    }
}
/**
 * @function hamming
 * Iterable con los momentos de integración,
 * luego del cuatro momentos se aplica Hamming.
 *
 * @param {Object<InputIED>} config
 *
 * @returns Iterator<It>
 *
 * @example --
 */
export function* modifiedHamming({ dy, it, h }: Input)
    : Iterator<{ advance: T, dif: number, P: number, Cs: number[] }> {
    /**
     * @interface {InputPreCorModifiedHamming} InputPreCorModifiedHamming
     *
     * @extends InputPreCor
     *
     * @property {number} P Predicho P(y(i+1))
     * @property {number[]} Cs      Arreglo de Correcciones
     */
    interface InputPreCorModifiedHamming extends InputPreCor {
        P: number;
        Cs: number[];
    }
    /**
     * @function predictor - modifiedHamming
     *  P(y(i+1)) =
     *
     * @param {InputPreCorModifiedHamming[]} input  Ultimas cuatro integraciones.
     *
     * @returns number
     */
    const predictor = (input: InputPreCorModifiedHamming[]): number => {
        const i = input.length - 1;
        return input[i - 3].advance[1] + 4 * h * (2 * input[i].dif - input[i - 1].dif + 2 * input[i - 2].dif) / 3;
    };
    /**
     * @function corrector - modifiedHamming
     *  C(y(i+1)) =
     *
     * @param {InputPreCorModifiedHamming[]} input  Ultimas cuatro integraciones.
     * @param {number} M                            Modificación.
     *
     * @returns number
     */
    const corrector = (input: InputPreCorModifiedHamming[], M: number): number => {
        const i = input.length - 1;
        return (9 * input[i].advance[1] - input[i - 2].advance[1] + 3 * h *
            (M + 2 * input[i].dif - input[i - 1].dif)) / 8;
    };
    /**
     * @function modificador - modifiedHamming
     *  M(y(i+1)) =
     * @param {number} predichoYMas1
     * @param {number} predichoY
     * @param {number} correccionY
     * @returns number
     */
    const modificador = (predichoYMas1: number, predichoY: number, correccionY: number): number =>
        predichoYMas1 - 112 * (predichoY - correccionY) / 121;
    /**
     * @function finalizador - modifiedHamming
     *  F(y(i+1)) =
     * @param {number} correccionYMas1
     * @param {number} predichoYMas1
     * @returns number
     */
    const finalizador = (correccionYMas1: number, predichoYMas1: number): number =>
        correccionYMas1 - 9 * (predichoYMas1 - correccionYMas1) / 121;

    const integration: InputPreCorModifiedHamming[] = [];

    for (let i = 0; i < 4; ++i) {
        const input = it.next().value;
        const output = {
            advance: input.advance,
            dif: input.dif,
            P: input.P ? input.P : input.advance[1],
            Cs: input.Cs ? input.Cs : [input.advance[1]],
        };
        yield output;
        integration.push(output);
    }
    let x = integration[3].advance[0];
    let y = integration[3].advance[1];
    for (; ;) {
        const P = predictor(integration);
        const M = modificador(P, integration[3].P, integration[3].Cs[integration[3].Cs.length - 1]);
        const C = corrector(integration, M);
        const F = finalizador(C, P);

        x += h;
        y += F;

        integration.push({
            advance: [x, y],
            dif: dy(x, y),
            P,
            Cs: [C],
        });
        integration.shift();

        yield integration[3];
    }
}
