import React from 'react';
import { ButtonProps } from './Inter';

const Button: React.FC<ButtonProps> = ({ value, onClick, disabled }) => {
    return (
        <button className='operator' onClick={onClick} disabled={disabled}>
            {value}
        </button>
    );
};

export default Button;