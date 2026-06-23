import { create } from 'zustand';

const useProductsStore = create((set) => ({
    products: [],

    setProducts: (products) => set({ products }),

    addProduct: (product) =>
        set((state) => ({
            products: [...state.products, product],
        })),

    removeProduct: (id) =>
        set((state) => ({
            products: state.products.filter((product) => product.id !== id),
        })),

    updateProduct: (updatedProduct) =>
        set((state) => ({
            products: state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            ),
        })),
}));

export default useProductsStore;