import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ProductItem from '../src/components/ProductItem';

describe('ProductItem', () => {
    it('renders product information correctly', async () => {
        const product = {
            id: '1',
            name: 'Leche',
            imageUri: null,
            location: null,
            contact: null,
            calendarEventId: null,
        };

        const { getByText } = await render(
            <ProductItem product={product} onDelete={jest.fn()} />
        );

        expect(getByText('Leche')).toBeTruthy();
        expect(getByText('Ubicación: pendiente')).toBeTruthy();
        expect(getByText('Contacto: pendiente')).toBeTruthy();
    });

    it('calls onDelete when delete button is pressed', async () => {
        const onDelete = jest.fn();
        const product = {
            id: '1',
            name: 'Leche',
            imageUri: null,
            location: null,
            contact: null,
            calendarEventId: null,
        };

        const { getByText } = await render(
            <ProductItem product={product} onDelete={onDelete} />
        );

        await fireEvent.press(getByText('❌'));

        expect(onDelete).toHaveBeenCalledWith('1');
    });
});
