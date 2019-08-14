/**
 * @function epsilon - Épsilon de la computadora
 *  Esta función devuelve el valor de épsilon de la computadora.
 *
 * @returns number
 */
export const epsilon =
    () => {
        if (!Number.EPSILON) {
            let E = 1;
            for (;;) {
                if (E + 1 > 1) {
                    // @ts-ignore
                    Number.EPSILON = E;
                } else {
                    break;
                }
                E /= 2;
            }
        }
        return Number.EPSILON;
    };

/**
 * @function Ea - Error Absoluto
 * [curryficada]
 *
 * @param {number} aproximado
 * @param {number} exacto
 *
 * @returns numbre
 *
 * @example --
 */
export const Ea = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Math.abs(aproximado - exacto);
    } else {
        throw new Error('Only allows number.');
    }
};
/**
 * @function Er - Error Relativo
 * [curryficada]
 *
 * @param {number} aproximado
 * @param {number} exacto
 *
 * @returns number
 *
 * @example --
 */
export const Er = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Math.abs((aproximado - exacto) / exacto);
    } else {
        throw new Error('Only allows number.');
    }
};
/**
 * @function Ep - Error Relativo Porcentual
 * [curryficada]
 *
 * @param {number} aproximado
 * @param {number} exacto
 *
 * @returns Boolean
 *
 * @example --
 */
export const Ep = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Er(aproximado)(exacto) * 100;
    } else {
        throw new Error('Only allows number.');
    }
};

/**
 * @function difAi - Diferencia Absoluta Individual
 * [curryficada]
 *  Comprueba que | X(j)[i] - X(j)[i-1] | <= epsilon(j) sea valido para las "n"
 * expresiones involucradas.
 *
 * @param {number[]} aproximados
 * @param {number[]} exactos
 * @param {number[]} epsilons
 *
 * @returns Boolean
 *
 * @example --
 */
export const difAi =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsilons: number[]): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('An arrangement of approximations was expected.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Expected an array of exact values.');
        }
        if (!Array.isArray(epsilons)) {
            throw new Error('An array of epsilon values was expected to be compared.');
        }
        const n = Math.min(
            aproximados.length,
            exactos.length,
            epsilons.length,
        );
        for (let i = 0; i < n; ++i) {
            if (Ea(aproximados[i])(exactos[i]) > epsilons[i]) {
                return false;
            }
        }
        return true;
    };

/**
 * @function difRi - Diferencia Relativa Individual
 * [curryficada]
 *  Comprueba que | X(j)[i] - X(j)[i-1] / X(j) | <= epsilon(j) sea valido para las "n" expresiones involucradas.
 *
 * @param {number[]} aproximados
 * @param {number[]} exactos
 * @param {number[]} epsilons
 *
 * @returns Boolean
 *
 * @example --
 */
export const difRi =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsilons: number[]): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('An arrangement of approximations was expected.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Expected an array of exact values.');
        }
        if (!Array.isArray(epsilons)) {
            throw new Error('An array of epsilon values was expected to be compared.');
        }
        const n = Math.min(
            aproximados.length,
            exactos.length,
            epsilons.length,
        );
        for (let i = 0; i < n; ++i) {
            if (Er(aproximados[i])(exactos[i]) > epsilons[i]) {
                return false;
            }
        }
        return true;
    };
/**
 * @function difAg - Diferencia Absoluta Global
 * [curryficada]
 * Producto de "1/n" por la Sumatoria de | X(j)[i] - X(j)[i-1] | <= epsilon.
 * @param {number[]} aproximados
 * @param {number[]} exactos
 * @param {number} epsilon
 *
 * @returns Boolean
 *
 * @example --
 */
export const difAg =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsi: number): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('An arrangement of approximations was expected.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Expected an array of exact values.');
        }
        const n = Math.min(
            aproximados.length,
            exactos.length,
        );
        let E = 0;
        for (let i = 0; i < n; ++i) {
            E += Ea(aproximados[i])(exactos[i]);
        }
        return E / n <= epsi;
    };
/**
 * @function difRg - Diferencia Relativa Global
 * [curryficada]
 * Producto de "1/n" por la Sumatoria de | X(j)[i] - X(j)[i-1] | <= epsilon.
 * @param {number[]} aproximados
 * @param {number[]} exactos
 * @param {number} epsilon
 *
 * @returns Boolean
 *
 * @example --
 */
export const difRg =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsi: number): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('An arrangement of approximations was expected.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Expected an array of exact values.');
        }
        const n = Math.min(
            aproximados.length,
            exactos.length,
        );
        let E = 0;
        for (let i = 0; i < n; ++i) {
            E += Er(aproximados[i])(exactos[i]);
        }
        return E / n <= epsi;
    };

