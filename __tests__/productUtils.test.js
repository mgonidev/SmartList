import { validateProductName } from '../src/utils/productUtils';

describe('validateProductName', () => {
    it('returns true for a valid product name', () => {
        expect(validateProductName('Leche')).toBe(true);
    });

    it('returns false for an empty string', () => {
        expect(validateProductName('')).toBe(false);
    });

    it('returns false for spaces only', () => {
        expect(validateProductName('   ')).toBe(false);
    });
});
