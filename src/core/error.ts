/**
 * Error Absoluto
 * @param {*} x1
 */
export const Ea = (aproximado: number) => (exacto: number) =>
    Math.abs(aproximado - exacto);
/**
 * Error Relativo
 * @param {*} x1
 */
export const Er = (aproximado: number) => (exacto: number) =>
    Math.abs((aproximado - exacto) / exacto);
/**
 * Error Relativo Porcentual
 * @param {*} x1
 */
export const Ep = (aproximado: number) => (exacto: number) =>
    Er(aproximado)(exacto) * 100;

