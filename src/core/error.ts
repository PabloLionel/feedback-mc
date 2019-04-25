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

