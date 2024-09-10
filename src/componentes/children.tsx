import React, { ReactNode } from 'react'; //Importa el React

const calculadora: React.FC<{ children: ReactNode }> = ( { children }) => {
    return <div className='ORIGEN'>{children}</div>
};

export default calculadora;