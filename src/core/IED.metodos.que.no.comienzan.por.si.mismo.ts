import { fnDiferencial } from './utils';
import { Ea } from './errores';

/**
 * Modulo de métodos de Integración de Ecuaciones Diferenciales (IED)
 * Métodos que comienzan por si mismos.
 */


interface InputMilne {
    dy: fnDiferencial;
    it: Iterator<{ advance: [number, number], dif: number, P?: number, Cs?: number[] }>;
    h: number;
    E: number;
}
export function* milne({ dy, it, h, E }: InputMilne)
    : Iterator<{ advance: [number, number], dif: number, P: number, Cs: number[] }> {

    interface InputPredicho {
        advance: [number, number];
        dif: number;
    }

    const predictor = (input: InputPredicho[]): number => {
        const i = input.length - 1;
        return input[i - 3].advance[1] + 4 * h * (2 * input[i].dif - input[i - 1].dif + 2 * input[i - 2].dif) / 3;
    };

    const corrector = (input: InputPredicho[], Pyprima: number): number => {
        const i = input.length - 1;
        return input[i - 1].advance[1] + h * (input[i - 1].dif + 4 * input[i].dif + Pyprima) / 3;
    };

    const integration: InputPredicho[] = [];

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

export function* hamming()
    : Iterator<{ advance: [number, number], dif: number, P: number, Cs: number[] }> {
    const predictor;
    const corrector;
    
    
}