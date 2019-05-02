/**
 * Épsilon de la computadora
 * Esta función devuelve el valor de épsilon
 * de la computadora.
 * @return EPSILON: number
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
 * Error Absoluto
 * @param aproximado: number
 * @param exacto: number
 */
export const Ea = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Math.abs(aproximado - exacto);
    } else {
        throw new Error('Only allows number.');
    }
};
/**
 * Error Relativo
 * @param aproximado: number
 * @param exacto: number
 */
export const Er = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Math.abs((aproximado - exacto) / exacto);
    } else {
        throw new Error('Only allows number.');
    }
};
/**
 * Error Relativo Porcentual
 * @param aproximado: number
 * @param exacto: number
 */
export const Ep = (aproximado: number) => (exacto: number) => {
    if (typeof aproximado === 'number' && typeof exacto === 'number') {
        return Er(aproximado)(exacto) * 100;
    } else {
        throw new Error('Only allows number.');
    }
};

/**
 * Diferencia Absoluta Individual
 *  Comprueba que | X(j)[i] - X(j)[i-1] | <= epsilon(j)
 * sea valido para las "n" expresiones involucradas.
 *  @param aproximados: number[]
 *  @param exactos: number[]
 *  @param epsilons: number[]
 */
export const difAi =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsilons: number[]): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('Se esperaba un arreglo de aproximaciones.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Se esperaba un arreglo de valores exactos.');
        }
        if (!Array.isArray(epsilons)) {
            throw new Error('Se esperaba un arreglo de valores epsilon a comparar.');
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
 * Diferencia Relativa Individual
 *  Comprueba que | X(j)[i] - X(j)[i-1] / X(j) | <= epsilon(j)
 * sea valido para las "n" expresiones involucradas.
 *  @param aproximados: number[]
 *  @param exactos: number[]
 *  @param epsilons: number[]
 */
export const difRi =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsilons: number[]): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('Se esperaba un arreglo de aproximaciones.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Se esperaba un arreglo de valores exactos.');
        }
        if (!Array.isArray(epsilons)) {
            throw new Error('Se esperaba un arreglo de valores epsilon a comparar.');
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
 * Diferencia Absoluta Global
 *  Producto de "1/n" por la Sumatoria de | X(j)[i] - X(j)[i-1] | <= epsilon.
 *  @param aproximados: number[]
 *  @param exactos: number[]
 *  @param epsilon: number
 */
export const difAg =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsi: number): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('Se esperaba un arreglo de aproximaciones.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Se esperaba un arreglo de valores exactos.');
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
 * Diferencia Relativa Global
 *  Producto de "1/n" por la Sumatoria de | X(j)[i] - X(j)[i-1] | <= epsilon.
 *  @param aproximados: number[]
 *  @param exactos: number[]
 *  @param epsilon: number
 */
export const difRg =
    (aproximados: number[]) =>
    (exactos: number[]) =>
    (epsi: number): boolean => {
        if (!Array.isArray(aproximados)) {
            throw new Error('Se esperaba un arreglo de aproximaciones.');
        }
        if (!Array.isArray(exactos)) {
            throw new Error('Se esperaba un arreglo de valores exactos.');
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

