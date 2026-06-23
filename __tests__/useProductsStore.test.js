import useProductsStore from '../src/store/useProductsStore';

describe('useProductsStore', () => {
    beforeEach(() => {
        useProductsStore.setState({ products: [] });
    });

    it('adds a product to the store', () => {
        const product = { id: '1', name: 'Leche' };

        useProductsStore.getState().addProduct(product);

        expect(useProductsStore.getState().products).toHaveLength(1);
        expect(useProductsStore.getState().products[0]).toEqual(product);
    });

    it('removes a product from the store', () => {
        const products = [
            { id: '1', name: 'Leche' },
            { id: '2', name: 'Pan' },
        ];

        useProductsStore.getState().setProducts(products);
        useProductsStore.getState().removeProduct('1');

        expect(useProductsStore.getState().products).toHaveLength(1);
        expect(useProductsStore.getState().products[0].id).toBe('2');
    });

    it('updates a product in the store', () => {
        const products = [{ id: '1', name: 'Leche' }];
        const updatedProduct = { id: '1', name: 'Leche descremada' };

        useProductsStore.getState().setProducts(products);
        useProductsStore.getState().updateProduct(updatedProduct);

        expect(useProductsStore.getState().products[0]).toEqual(updatedProduct);
    });
});
