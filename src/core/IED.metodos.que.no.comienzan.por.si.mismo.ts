import { fnDiferencial } from './utils';
import { Ea } from './errores';

/**
 * Modulo de métodos de Integración de Ecuaciones Diferenciales (IED)
 * Métodos que comienzan por si mismos.
 */


interface Input {
    dy: fnDiferencial;
    it: Iterator<{ advance: [number, number], dif: number, P?: number, Cs?: number[] }>;
    h: number;
}
interface InputIED extends Input {
    E: number;
}
export function* milne({ dy, it, h, E }: InputIED)
    : Iterator<{ advance: [number, number], dif: number, P: number, Cs: number[] }> {

    interface InputPreCor {
        advance: [number, number];
        dif: number;
    }

    const predictor = (input: InputPreCor[]): number =>
        input[0].advance[1] + 4 * h * (2 * input[3].dif - input[2].dif + 2 * input[1].dif) / 3;

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

export function* hamming({ dy, it, h, E }: InputIED)
    : Iterator<{ advance: [number, number], dif: number, P: number, Cs: number[] }> {
    interface InputPreCor {
        advance: [number, number];
        dif: number;
    }

    const predictor = (input: InputPreCor[]): number =>
        input[0].advance[1] + 4 * h * (2 * input[3].dif - input[2].dif + 2 * input[1].dif) / 3;

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

export function* modifiedHamming({ dy, it, h }: Input)
    : Iterator<{ advance: [number, number], dif: number, P: number, Cs: number[] }> {

    interface InputPreCor {
        advance: [number, number];
        dif: number;
        P: number;
        Cs: number[];
    }

    const predictor = (input: InputPreCor[]): number => {
        const i = input.length - 1;
        return input[i - 3].advance[1] + 4 * h * (2 * input[i].dif - input[i - 1].dif + 2 * input[i - 2].dif) / 3;
    };

    const corrector = (input: InputPreCor[], M: number): number => {
        const i = input.length - 1;
        return (9 * input[i].advance[1] - input[i - 2].advance[1] + 3 * h *
            (M + 2 * input[i].dif - input[i - 1].dif)) / 8;
    };

    const modificador = (predichoYMas1: number, predichoY: number, correccionY: number) =>
        predichoYMas1 - 112 * (predichoY - correccionY) / 121;

    const finalizador = (correccionYMas1: number, predichoYMas1: number) =>
        correccionYMas1 - 9 * (predichoYMas1 - correccionYMas1) / 121;

    const integration: InputPreCor[] = [];

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
