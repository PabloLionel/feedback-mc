export const N = 2;
const difEquidistante = (v: number[]) =>
    (new Array(v.length - 1))
        .fill(0)
        .map((n: number, i: number) => v[i + 1] - v[i]);
