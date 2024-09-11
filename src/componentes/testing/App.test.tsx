import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from "../../App";
import '@testing-library/jest-dom';

describe('Counter', () => {
    test('renders initial count', () => {
        render(<Counter />);
        const countElement = screen.getByText('Contador: 0');
        expect(countElement).toBeInTheDocument();
    });

    test('increments count when button is clicked', async () => {
        render(<Counter />);
        const incrementButton = screen.getByRole('button', {
            name: /Incrementar/i,
        });
        await userEvent.click(incrementButton);
        const updatedCountElement = screen.getByText('Contador: 1');
        expect(updatedCountElement).toBeInTheDocument();
    });

    test('decrements count when button is clicked', async () => {
        render(<Counter />);
        const decrementButton = screen.getByRole('button', {
            name: /Decrementar/i,
        });
        await userEvent.click(decrementButton);
        const updatedCountElement = screen.getByText('Contador: -1');
        expect(updatedCountElement).toBeInTheDocument();
    });

    test('matches snapshot', () => {
        const { asFragment } = render(<Counter />);
        expect(asFragment()).toMatchSnapshot();
    });
});