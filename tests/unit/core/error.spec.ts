import * as core from '../../../src/core';

describe('Calculo de Erroes Abs, Rel, Por.', () => {
  describe('Error Absoluto.', () => {
    test('Calculo correcto del numero e y su aproximado de dos decimales.', () => {
      expect(core.Ea(2.71)(Math.E)).toBe(0.008281828459045126);
    });
    test('Lanzar throw del numero e por un valor no numerico.', () => {
      // @ts-ignore
      expect(core.Ea('a')(Math.E)).toThrow('Only allows number.');
    });
  });
  describe('Error Relativo.', () => {
    test('Calculo correcto del numero e y su aproximado de dos decimales.', () => {
      expect(core.Er(2.71)(Math.E)).toBe(0.0030467144253912685);
    });
  });
  describe('Error Porcentual.', () => {
    test('Calculo correcto del numero e y su aproximado de dos decimales.', () => {
      expect(core.Ep(2.71)(Math.E)).toBe(0.30467144253912685);
    });
  });
});
